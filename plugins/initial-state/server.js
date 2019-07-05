const {call, put, all, select, fork, spawn, take} = require("redux-saga/effects");
const consume = require("pluginbot/effects/consume");
const sagaMiddleware = require("../../middleware/express-saga-middleware");

function* run(config, provide, channels) {
    const configurationManager = yield consume(channels.configurationManager);
    let middleware =  function*(req, res, next){
        const publicConfigurations = yield call(configurationManager.getConfigurations, true);
    };
    middleware = yield call(sagaMiddleware, middleware);

    const routeDefinition = {
            endpoint : "/initial-state",
            method : "get",
            middleware : [middleware],
            permissions : [],
            description : "Get initial state"

        }
    yield provide(routeDefinition);

}

module.exports = {run};