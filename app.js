//todo, integrate this into a plugin.

const { EVENT, SET_OPTIONS, INIT_STORE } = require("./config/redux/actions");
const defaultAppState = {
  eventReducer: null,
  eventSagas: {},
  options: {},
};

function appReducer(state = defaultAppState, action) {
  //change the store state based on action.type
  switch (action.type) {
    case EVENT:
      return state;
    case INIT_STORE:
      return action.initialStore;
    case SET_OPTIONS: {
      const options = Object.assign({}, state.options, action.options);
      return Object.assign({}, state, {
        options: options,
      });
    }
    default:
      return state;
  }
}

module.exports = async function(configPath) {
  try {
    const Pluginbot = require("pluginbot");
    const app = await Pluginbot.createPluginbot(configPath);
    await app.initialize({ servicebot: appReducer });
    return app;
  } catch (e) {
    console.error(e);
  }
};
