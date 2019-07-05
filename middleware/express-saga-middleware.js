const {eventChannel, END} = require("redux-saga");
const {take, fork, spawn, call} = require("redux-saga/effects");


function* reqSaga(requestChannel, sagaMiddleware){
    while(true){
        const {req, res, next} = yield take(requestChannel);
        yield fork(sagaMiddleware, req, res, next);

    }
}
/**
 *
 * @param saga - saga that takes in req res next params
 */

module.exports = function*(saga){
    let middleware = null;
    const channel = eventChannel(emitter => {

        // this code is synchronously called so not toooo bad
        middleware = function(req, res, next){
            emitter({req, res, next});
        };

        return () => {
            console.error("unsubscribe...")
        }
    });
    const requestHandler = yield spawn(reqSaga, channel, saga);
    return middleware;
}



