const consume = require("pluginbot/effects/consume");
const CORE_INPUTS = require("./core-inputs");

module.exports = {
    *run (config, provide, services) {
        const handlers = CORE_INPUTS.map(input => {
            try {
                const handler = require(`./${input}/widgetHandler`);

                if (handler && (handler.priceHandler || handler.validator)) {
                    return {handler, name: input};
                }
            }catch(e){
                return {name : input};
            }
        });
        yield provide({inputHandler : handlers});
    }

};