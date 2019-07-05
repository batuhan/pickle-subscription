import React from "react";
import TagsInput from "react-tagsinput"

// todo: all the imports from the main app will result in duplicate code.... need to fix this!
import handler from "./widgetHandler";
import WidgetPricingInput from '../../../views/components/utilities/widget-inputs/WidgetPricingInput.jsx';
import {adjust} from '../../../views/components/utilities/widget-inputs/WidgetPriceAdjustment';


const Tags = (props) => {
    return (
      <div className="sb-form-group __addon-options-widget-config">
        <label className="_label-">Available Options</label>
        <TagsInput
          className="_input- react-tagsinput"
          inputProps={{placeholder: 'Add Options'}}
          {...props.input}
          value={props.input.value || []}
        />
      </div>
    );
};

class SelectPricing extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePercentPriceChange = this.handlePercentPriceChange.bind(this);
        this.state = (props.configValue && props.configValue.pricing && typeof props.configValue.pricing.value === 'object') ? props.configValue.pricing.value : {};
    }

    componentDidUpdate(prevProps, prevState) {
        const self = this;
        if (this.props.configValue.value && prevProps.configValue && prevProps.configValue.value && prevProps.configValue.value.length > this.props.configValue.value.length) {
            const propsToRemove = prevProps.configValue.value.filter(prop => self.props.configValue.value.indexOf(prop) < 0);
            const newState = propsToRemove.reduce((acc, prop) => {
                acc[prop] = undefined;
                return acc;
            }, {});
            this.setState(newState, () => {
                self.props.input.onChange(self.state);
            });
        }

    }

    handleChange(name) {
        const self = this;
        return function (floatvalue){
            self.setState({[name]: floatvalue}, () => {
                self.props.input.onChange(self.state);
            });
        }
    }

    handlePercentPriceChange(e, maskedValue, floatvalue){
        const {name} = e.target;
        const self = this;
        this.setState({[name]: floatvalue}, () => {
            self.props.input.onChange(self.state);
        });
    }

    render() {
        const {input, configValue} = this.props;
        const self = this;
        const operation = configValue && configValue.pricing && configValue.pricing.operation;
        const pricingValue = configValue && configValue.pricing && configValue.pricing.value;
        return (
          <div className="addon-options-widget-price-inputs-wrapper">
            {configValue ? configValue.value && configValue.value.map((option, index) => {
                    const input = {
                        onChange : self.handleChange(option),
                        name : option,
                        value :  (pricingValue && pricingValue[option]) || 0
                    };

                    return (
                      <div>
                        {option}
                        {' '}
: 
                        {' '}
                        <WidgetPricingInput input={input} operation={operation} />
                      </div>
);
                }):
            <span className="addon-widget-price-tip">Add some available options above</span>
                }
          </div>
        );
    }
}

const SelectWidget = (props) => {
    const {input, configValue, label} = props;
    return (
      <div className="sb-form-group __addon-options-widget">
        {label && <label className="_label-">{label}</label>}
        <div className="form-input-flex">
          <select className="_input- __input-addon-options-widget" {...input}>
            <option value="" key="0-default">Choose One</option>
            { configValue && configValue.value && configValue.value.map((option, index) => {
                            const price = configValue.pricing && configValue.pricing.value && configValue.pricing.value[option];
                            return (
                              <option key={index} value={option}>
                                {(price && configValue.pricing.operation) ? `${option}: ${adjust(configValue.pricing.operation, price)}` : `${option}`}
                              </option>
)
                        }
                    )}
          </select>
        </div>
      </div>
    )
};


const widget = {
    widget: SelectWidget,
    type: "select",
    label: "Select",
    config: Tags,
    pricing: SelectPricing,
    handler
};

export default widget