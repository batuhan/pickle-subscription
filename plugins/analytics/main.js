const consume = require("pluginbot/effects/consume");
const {call} = require("redux-saga/effects");

const run = function*(config, provide, services) {
    const db = yield consume(services.database);
    const analytics = require("./analytics")
    const routeDefinition = require("./api")(analytics)
    yield provide({routeDefinition, analytics})
};
module.exports = {run};