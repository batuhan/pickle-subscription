import React from "react";
import getSymbolFromCurrency from "currency-symbol-map";

/**
 * This is used to display Stripe amount values,
 * Since Stripe takes amount in cents, we want to convert it and display dollar value.
 */
function getPriceValue(value) {
  return `$${(value / 100).toFixed(2)}`;
}

function formatMoney(price, c, d, t) {
  let n = price;
  const cNew = isNaN((c = Math.abs(c))) ? 2 : c;
  const dNew = d == undefined ? "." : d;
  const tNew = t == undefined ? "," : t;
  const s = n < 0 ? "-" : "";
  const i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(cNew))));
  let j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + tNew : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${tNew}`) +
    (cNew
      ? dNew +
        Math.abs(n - i)
          .toFixed(cNew)
          .slice(2)
      : "")
  );
}

const Price = function(props) {
  const price = formatMoney((props.value / 100).toFixed(2), ",", ".");
  const prefix = props.prefix || "$";
  return <span>{prefix + price}</span>;
};

const getPrice = (myService, serviceType = null) => {
  const serType = myService.type || serviceType;
  const prefix = getSymbolFromCurrency(myService.currency);

  if (serType === "subscription") {
    return (
      <span>
        <Price value={myService.amount} prefix={prefix} />
        {myService.interval_count === 1
          ? " /"
          : ` / ${myService.interval_count}`}{" "}
        {` ${myService.interval}`}
      </span>
    );
  }
  if (serType === "one_time") {
    return (
      <span>
        <Price value={myService.amount} prefix={prefix} />
      </span>
    );
  }
  if (serType === "custom") {
    return false;
  }
  return (
    <span>
      <Price value={myService.amount} prefix={prefix} />
    </span>
  );
};
/**
 * To be deprecated after refactoring all code
 * @param myService - a service template record row
 * @returns {*}
 */
const getBillingType = myService => {
  const serType = myService.type;

  if (serType === "subscription") {
    return "Subscription";
  }
  if (serType === "one_time") {
    return "One-time";
  }
  if (serType === "custom") {
    return "Ongoing";
  }
  if (serType === "split") {
    return "Scheduled";
  }
  return "Other";
};

/**
 * Takes a service template and returns the text from row.type after formatting
 * @param row - a service template record row
 * @returns {string}
 */
const serviceTypeFormatter = row => {
  const { type } = row;

  const text = type.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export { Price, getPrice, getBillingType, serviceTypeFormatter, getPriceValue };
