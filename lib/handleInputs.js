// takes in a request and outputs the updated instance

// todo: move property system into plugins.
function getHandlers(handlerArray) {
  if (!handlerArray) {
    console.error("Handlers not provided..");
  }
  return handlerArray.reduce((acc, handler) => {
    acc[handler.name] = handler;
    return acc;
  }, {});
}

function toCents(amount) {
  if (typeof amount !== "string" && typeof amount !== "number") {
    throw new Error("Amount passed must be of type String or Number.");
  }

  return Math.round(
    100 *
      parseFloat(
        typeof amount === "string" ? amount.replace(/[$,]/g, "") : amount,
      ),
  );
}
function getPriceAdjustments(properties, handlers) {
  if (properties) {
    return properties.reduce((acc, prop) => {
      if (
        handlers[prop.type] &&
        handlers[prop.type].priceHandler &&
        prop.config &&
        prop.config.pricing &&
        prop.config.pricing.operation
      ) {
        const adjuster = handlers[prop.type].priceHandler;
        const valToPUsh = {
          name: prop.name,
          type: prop.type,
          operation: prop.config.pricing.operation,
          value: adjuster(prop.data, prop.config) || 0,
        };
        acc.push(valToPUsh);
      }
      return acc;
    }, []);
  }
  return [];
}

module.exports = {
  getBasePrice(properties, handlers, currentPrice, cents = false) {
    let adjustments = [];
    try {
      adjustments = getPriceAdjustments(properties, handlers);
    } catch (e) {
      console.error("price error", e);
    }

    let additions = 0;
    let multiplication = 1;
    for (const adjustment of adjustments) {
      const { operation } = adjustment;

      switch (operation) {
        case "add":
          additions += cents ? toCents(adjustment.value) : adjustment.value;
          break;
        case "subtract":
          additions -= cents ? toCents(adjustment.value) : adjustment.value;
          break;
        case "multiply":
          multiplication += adjustment.value / 100;
          break;
        case "divide":
          multiplication -= adjustment.value / 100;
          break;
        default:
          throw `Bad operation : ${operation}`;
      }
    }
    // make sure not dividing by 0
    if (multiplication === 0) {
      multiplication = 1;
    }

    let basePrice = (currentPrice - additions) / multiplication;
    if (basePrice < 0) {
      basePrice = 0;
    }
    return basePrice;
  },
  getPrice(properties, handlers, basePrice, cents = false) {
    let adjustments = [];
    try {
      adjustments = getPriceAdjustments(properties, handlers);
    } catch (e) {
      console.error("price error", e);
    }
    let price =
      basePrice +
      adjustments.reduce((acc, adjustment) => {
        const { operation } = adjustment;
        if (adjustment.value === null || adjustment.value === undefined) {
          return acc;
        }
        switch (operation) {
          case "add":
            acc += cents ? toCents(adjustment.value) : adjustment.value;
            break;
          case "subtract":
            acc -= cents ? toCents(adjustment.value) : adjustment.value;
            break;
          case "multiply":
            acc += basePrice * (adjustment.value / 100);
            break;
          case "divide":
            acc -= basePrice * (adjustment.value / 100);
            break;
          default:
            throw `Bad operation : ${operation}`;
        }
        return acc;
      }, 0);
    if (price < 0) {
      price = 0;
    }
    return price;
  },
  validateProperties(properties, handlers) {
    // let handlers = getHandlers(handlerArray);
    return properties.reduce((acc, prop) => {
      // todo: reduce duplicate code that exists here and in webpack code.

      if (!handlers[prop.type]) {
        return acc;
      }
      const { validator } = handlers[prop.type];
      if (validator) {
        const validationResult = validator(prop.data, prop.config);
        if (validationResult != true) {
          prop.error = validationResult;
          acc.push(prop);
        }
      }
      return acc;
    }, []);
  },
  getPriceAdjustments,
  toCents,
};
