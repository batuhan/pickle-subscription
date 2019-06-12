//takes in a request and outputs the updated instance

//todo: move property system into plugins.

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
  } else {
    return [];
  }
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
      const operation = adjustment.operation;

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
          throw "Bad operation : " + operation;
      }
    }
    return (currentPrice - additions) / multiplication;
  },
  getPrice: function(properties, handlers, basePrice, cents = false) {
    let adjustments = [];
    try {
      adjustments = getPriceAdjustments(properties, handlers);
    } catch (e) {
      console.error("price error", e);
    }
    return (
      basePrice +
      adjustments.reduce((acc, adjustment) => {
        const operation = adjustment.operation;
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
            throw "Bad operation : " + operation;
        }
        return acc;
      }, 0)
    );
  },
  getPriceAdjustments,
  toCents,
};
