import React from "react";
import CurrencyInput from "react-currency-input";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { toCents } from "../../../../lib/handleInputs";

class WidgetPricingInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(isCents) {
    const self = this;
    return function(e, maskedValue, floatvalue) {
      const { name } = e.target;
      const value = isCents ? toCents(floatvalue) : floatvalue;
      self.setState({ [name]: value }, () => {
        self.props.input.onChange(self.state[name]);
      });
    };
  }

  render() {
    // renders a number input or a currency input based on the operation type
    const self = this;
    const { props } = this;
    const {
      options,
      operation,
      input: { name, value, onChange },
    } = props;
    const prefix = options.currency
      ? getSymbolFromCurrency(options.currency.value)
      : "";

    if (operation == "add" || operation == "subtract") {
      const price = (value / 100).toFixed(2);
      return (
        <CurrencyInput
          className="form-control addon-checkbox-widget-price-input"
          name={name}
          prefix={prefix}
          decimalSeparator="."
          thousandSeparator=","
          precision="2"
          onChangeEvent={this.handleChange(true)}
          value={price}
        />
      );
    }
    if (operation == "divide" || operation == "multiply") {
      return (
        <CurrencyInput
          className="form-control addon-checkbox-widget-price-input"
          name={name}
          decimalSeparator="."
          precision="0"
          suffix="%"
          onChangeEvent={this.handleChange(false)}
          value={value}
        />
        // <input {...props.input} type="number" className="form-control addon-checkbox-widget-price-input"/>
      );
    }
    return (
      <span className="addon-widget-price-tip">Select a pricing type</span>
    );
  }
}

const mapStateToProps = state => {
  return {
    options: state.options,
  };
};
export default connect(mapStateToProps)(WidgetPricingInput);
