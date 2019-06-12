const {
  call,
  put,
  all,
  select,
  fork,
  spawn,
  take,
  takeEvery,
} = require("redux-saga/effects");
const consume = require("pluginbot/effects/consume");

// this plugin will change in future.. for now handles basic hooks into stages of a service lifecycle
// todo: somehow merge lifecycle management into the event system... too much similar functionality in different systems
function* run(config, provide, channels) {
  const lifecycles = {
    pre: [],
    post: [],
    pre_decom: [],
    post_decom: [],
    pre_reactivate: [],
    post_reactivate: [],
    pre_property_change: [],
    post_property_change: [],
  };

  // collect lifecycle hooks
  yield fork(function*() {
    while (true) {
      const hook = yield consume(channels.lifecycleHook);
      lifecycles[hook.stage].push(hook);
    }
  });

  const lifecycleManager = {
    async preProvision({ request, template }) {
      for (const hook of lifecycles.pre) {
        await hook.run({ request, template });
      }
    },
    async postProvision({ request, template, instance }) {
      let result = {};
      for (const hook of lifecycles.post) {
        const hookresult = await hook.run({ request, template, instance });
        result = { ...result, ...hookresult };
      }
      return result;
    },
    async preDecommission({ instance }) {
      let result = {};
      for (const hook of lifecycles.pre_decom) {
        const hookresult = await hook.run({ instance });
        result = { ...result, ...hookresult };
      }
      return result;
    },
    async postDecommission({ instance }) {
      let result = {};
      for (const hook of lifecycles.post_decom) {
        const hookresult = await hook.run({ instance });
        result = { ...result, ...hookresult };
      }
      return result;
    },
    async preReactivate({ instance }) {
      let result = {};
      for (const hook of lifecycles.pre_reactivate) {
        const hookresult = await hook.run({ instance });
        result = { ...result, ...hookresult };
      }
      return result;
    },
    async postReactivate({ instance }) {
      let result = {};
      for (const hook of lifecycles.post_reactivate) {
        const hookresult = await hook.run({ instance });
        result = { ...result, ...hookresult };
      }
      return result;
    },
    async prePropertyChange({ instance, property_updates }) {
      let result = {};
      for (const hook of lifecycles.pre_property_change) {
        const hookresult = await hook.run({ instance, property_updates });
        result = { ...result, ...hookresult };
      }
      return result;
    },
    async postPropertyChange({ instance }) {
      let result = {};
      for (const hook of lifecycles.post_property_change) {
        const hookresult = await hook.run({ instance });
        result = { ...result, ...hookresult };
      }
      return result;
    },
  };
  yield provide({ lifecycleManager });
}
module.exports = { run };
