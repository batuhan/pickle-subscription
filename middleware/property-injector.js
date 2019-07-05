const _ = require("lodash");
const System = require("../models/system-options");
const Stripe = require("../config/stripe");

const injectProperties = function() {
  return function(req, res, next) {
    const store = require("../config/redux/store");
    const { options } = store.getState();
    Object.defineProperty(res.locals, "sysprops", {
      get() {
        return store.getState().options;
      },
    });
    if (options.stripe_publishable_key) {
      res.cookie("spk", options.stripe_publishable_key);
    } else {
      res.clearCookie("spk", { path: "/" });
    }
    Stripe.setKeys(options);
    next();
  };
};

module.exports = injectProperties;
