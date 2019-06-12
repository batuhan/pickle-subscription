const { put, call, select, all } = require("redux-saga/effects");
const { setOptions } = require("../../config/redux/actions");
const consume = require("pluginbot/effects/consume");
const routes = require("./routes");

// todo: move population of initial to this plugin.

// todo: handle bad plugin options - errors will suck now probably - don't like all these parameters either../
function* getPluginOptions(publicOnly = false, valueOnly = false) {
  // todo: 🚨🚨🚨🚨 pluginbot needs consume current - this is currently bad practice since it's not consuming services.
  const pluginOptions = yield select(
    state => state.pluginbot.services.pluginOption,
  );
  const optionEffecs = {};
  for (const option of pluginOptions || []) {
    if (!publicOnly || option.visible) {
      optionEffecs[option.name] = call(function*() {
        const value = yield call([option, "getOption"]);
        return valueOnly ? value : { ...option.data, value, plugin: true };
      });
    }
  }
  return yield all(optionEffecs);
}

module.exports = {
  *run(config, provide, services) {
    const db = yield consume(services.database);
    const Settings = require("../../models/system-options");
    const defaultOptions = require("./default-options");

    // populate options
    yield call(
      defaultOptions.populateOptions,
      defaultOptions.options,
      Settings,
    );
    const initialOptions = yield call(Settings.getOptions);

    // todo: this is bad - can lose properties in initialization because not consuming. - fix by consuming!
    const pluginOptions = yield call(getPluginOptions, false, true);

    yield put(setOptions({ ...initialOptions, ...pluginOptions }));

    // todo: fix complexity due to the split between system option in model and options provided by plugins
    // Configuration service is how the app interfaces with plugin's configurations.
    const configurationManager = {
      *getConfigurations(publicOnly = false) {
        const publicOptions = yield call(
          Settings.find,
          publicOnly ? { public: true } : {},
        );

        const results = publicOptions.reduce((acc, entity) => {
          acc[entity.data.option] = entity.data;
          return acc;
        }, {});
        const pluginResults = yield call(getPluginOptions, publicOnly);
        return { ...results, ...pluginResults };
      },

      *getConfiguration(name) {
        // todo make this not have to get everything...
        const settings = yield call(configurationManager.getConfigurations);
        return settings[name];
      },
      *updateConfigurations(settingsArray, publicOnly = false) {
        // this is messy because of the two different places settings currentlh live
        // refactoring would mean all settings are in plugins
        const publicSettings = yield call(
          configurationManager.getConfigurations,
          publicOnly,
        );
        const groupedUpdates = settingsArray.reduce(
          (acc, optionToUpdate) => {
            const publicSetting = publicSettings[optionToUpdate.option];
            if (publicSetting) {
              acc[publicSetting.plugin ? "plugin" : "core"].push(
                optionToUpdate,
              );
            }
            return acc;
          },
          { plugin: [], core: [] },
        );

        // todo: batchUpdate needs to stop proxying... can't call on it.
        const updatedCore = yield Settings.batchUpdate(groupedUpdates.core);

        // todo: 🚨🚨🚨🚨 pluginbot needs consume current - this is currently bad practice since it's not consuming services.
        const pluginOptions =
          (yield select(state => state.pluginbot.services.pluginOption)) || [];
        const mappedPluginOption = pluginOptions.reduce((acc, option) => {
          acc[option.name] = option;
          return acc;
        }, {});

        const updatedPlugin = [];
        for (const pluginOptionToUpdate of groupedUpdates.plugin) {
          const setter =
            mappedPluginOption[pluginOptionToUpdate.option].setOption;
          if (setter) {
            updatedPlugin.push(call(setter, pluginOptionToUpdate.value));
          }
        }

        const updateResult = yield all(updatedPlugin);

        return [...updatedCore, ...updateResult];
      },
    };
    const routeDefinition = yield call(routes, configurationManager);
    yield provide({ routeDefinition, configurationManager });
    const initialPublic = yield call(
      configurationManager.getConfigurations,
      true,
    );

    // app needs options todo: can this be done better?
    yield put({ type: "FINISHED_SETUP", options: initialPublic });
  },
};
