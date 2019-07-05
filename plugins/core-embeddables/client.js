import Billing from "./embeddables/billing-settings";
import Checkout from "./embeddables/checkout";

const consume = require("pluginbot/effects/consume");

module.exports = {
    *run (config, provide, services) {
        yield provide({embeddable : [Checkout, Billing]});
    }

};