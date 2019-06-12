const {
  call,
  take,
  takeEvery,
  cancel,
  actionChannel,
} = require("redux-saga/effects");
const express = require("express");
const consume = require("pluginbot/effects/consume");
const app = require("./app");
const { END } = require("redux-saga");

module.exports = {
  *run(config, provide, services) {
    try {
      const setup = yield consume(services.startSetup);
      const cancelChannel = yield actionChannel("FINISHED_SETUP");

      // wait for api to send initial configuration
      const expressApp = yield consume(services.expressApp);
      const { initialConfig, response } = yield call(
        app,
        config.appConfig,
        config.initialConfig || {},
        setup.dbConfig,
        expressApp,
      );

      // db config already exists so don't provide one.
      if (!setup.dbConfig) {
        const dbConfig = {
          host: initialConfig.db_host,
          user: initialConfig.db_user,
          database: initialConfig.db_name,
          password: initialConfig.db_password,
          port: initialConfig.db_port,
        };
        yield provide({ dbConfig });
      }
      yield provide({ initialConfig });
      const finish = yield take(cancelChannel);
      if (response) {
        response.json({ message: "Setup complete", options: finish.options });
      }
    } finally {
      console.log("CLOSIN DOWN THE SETUP!");
    }
  },
};
