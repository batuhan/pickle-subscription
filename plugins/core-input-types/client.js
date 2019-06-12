const consume = require("pluginbot/effects/consume");
const CORE_INPUTS = require("./core-inputs");

module.exports = {
  *run(config, provide, services) {
    const widgets = CORE_INPUTS.map(input => {
      const widget = require(`./${input}/widget`).default;
      if (widget) {
        return widget;
      } 
        throw `${input  } has no widget defined`;
      
    });
    yield provide({ widget: widgets });
  },
};
