const consume = require("pluginbot/effects/consume");
const {call, put, takeEvery, all, fork} = require('redux-saga/effects')
const {setOptions} = require("../../config/redux/actions");

function getNotificationSagas() {
    // todo move table to be managed by THIS plugin
    const NotificationTemplate = require("../../models/notification-template");
    return new Promise(function (resolve, reject) {
        NotificationTemplate.findAll(true, true, function (templates) {
            resolve(templates.map((template) => {
                    const callCreateNotification = function (action) {
                        return template.createNotification(action.event_object);
                    };

                    return call(function* () {
                        yield takeEvery(sagaEventPattern(template.get('event_name')), callCreateNotification)
                    });
                })
            )
        })
    });
}

const setOptionSaga = function* (action) {
    yield put(setOptions(action.event_object));
}
let sagaEventPattern = function (event_name) {
    return function (action) {
        return action.type === "EVENT" && action.event_name === event_name
    }
}


module.exports = {
    *run (config, provide, services) {
        const database = yield consume(services.database);
        const notificationSagas = yield call(getNotificationSagas);
        const notificationTask = yield fork(all, notificationSagas);
        const optionTask = yield takeEvery(sagaEventPattern("system_options_updated"), setOptionSaga);
    }
};