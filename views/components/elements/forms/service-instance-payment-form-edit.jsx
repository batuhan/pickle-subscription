import React from "react";
import Load from "../../utilities/load.jsx";
import Inputs from "../../utilities/inputs.jsx";
import { DataForm } from "../../utilities/data-form.jsx";
import Buttons from "../buttons.jsx";
import Alerts from "../alerts.jsx";

class ServiceInstanceFormEdit extends React.Component {
  constructor(props) {
    super(props);
    const instance = this.props.myInstance;
    this.state = {
      instance,
      loading: false,
      success: false,
      alert: {},
      countDown: 5,
    };
    this.handleResponse = this.handleResponse.bind(this);
    this.handleCountDownClose = this.handleCountDownClose.bind(this);
    this.getValidators = this.getValidators.bind(this);
  }

  handleResponse(response) {
    if (!response.error && response.type != "StripeInvalidRequestError") {
      this.setState({ success: true, submitting: false });
    } else if (response.type == "StripeInvalidRequestError") {
      if (response.message == "This customer has no attached payment source") {
        this.setState({
          alert: {
            type: "danger",
            message: "This customer has no attached payment source.",
            icon: "exclamation-circle",
          },
        });
      } else {
        this.setState({
          alert: {
            type: "danger",
            message: "Stripe error: invalid subscription.",
            icon: "exclamation-circle",
          },
        });
      }
    }
  }

  handleCountDownClose() {
    if (this.state.countDown <= 0) {
      this.props.onHide();
    } else {
      this.setState({ countDown: this.state.countDown - 1 });
    }
  }

  getValidators(references = null) {
    // This function dynamically generates validators depending on what custom properties the instance has.
    // optional references: the service template's references.service_template_properties
    // Defining general validators
    const validateRequired = val => {
      return val === 0 || val === false || (val != "" && val != null);
    };
    const validateEmptyString = val => {
      return val.trim() != "";
    };
    const validateNumber = val => {
      return !isNaN(parseFloat(val)) && isFinite(val);
    };
    // Defining validators
    const validateTrialDay = val => {
      return (
        (validateRequired(val) && validateNumber(val) && val >= 0) || {
          error:
            "Field trial days is required and must be a number greater than or equal 0",
        }
      );
    };
    const validateAmount = val => {
      return (
        (validateRequired(val) && validateNumber(val) && val >= 0) || {
          error:
            "Field amount is required and must be a number greater than or equal 0",
        }
      );
    };
    const validateInterval = val => {
      return (
        (validateRequired(val) &&
          (val == "day" ||
            val == "week" ||
            val == "month" ||
            val == "year")) || {
          error: "Field interval must be day, week, month or year.",
        }
      );
    };
    const validateIntervalCount = val => {
      return (
        (validateRequired(val) && validateNumber(val) && val >= 1) || {
          error:
            "Field interval count is required and must be a number greater than 0",
        }
      );
    };

    const validatorJSON = {
      trial_period_days: validateTrialDay,
      amount: validateAmount,
      interval: validateInterval,
      interval_count: validateIntervalCount,
    };

    return validatorJSON;
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    }
    if (this.state.success) {
      const self = this;

      setTimeout(function() {
        self.handleCountDownClose();
      }, 1000);

      return (
        <div>
          <div className="p-20">
            <p>
              <strong>Success! your payment plan has been updated.</strong>
            </p>
          </div>
          <div className="modal-footer text-right">
            <Buttons
              btnType="default"
              text={`Close ${this.state.countDown}`}
              onClick={this.props.onHide}
            />
          </div>
        </div>
      );
    }
    const { instance } = this.state;

    if (this.state.instance.payment_plan != null) {
      const paymentPlan = this.state.instance.payment_plan;

      const getAlerts = () => {
        if (this.state.alert.message) {
          return (
            <Alerts
              type={this.state.alert.type}
              message={this.state.alert.message}
              icon={this.state.alert.icon}
            />
          );
        }
      };

      return (
        <div>
          {getAlerts()}

          <DataForm
            validators={this.getValidators(null)}
            handleResponse={this.handleResponse}
            url={`/api/v1/service-instances/${instance.id}/change-price`}
            method="POST"
          >
            <div className="p-20">
              <div className="row">
                <div className="basic-info col-md-12">
                  <p>
                    <strong>
                      Payment Plan For
                      {instance.name}
                    </strong>
                  </p>
                  <p>{instance.description}</p>

                  <Inputs
                    type="hidden"
                    name="name"
                    value={paymentPlan.name}
                    onChange={function() {}}
                    receiveOnChange
                    receiveValue
                  />

                  <Inputs
                    type="text"
                    maxLength="22"
                    name="statement_descriptor"
                    label="Statement Descriptor"
                    defaultValue={paymentPlan.statement_descriptor}
                    onChange={function() {}}
                    receiveOnChange
                    receiveValue
                  />

                  <Inputs
                    type="number"
                    name="trial_period_days"
                    label="Trial Period (Days)"
                    defaultValue={
                      paymentPlan.trial_period_days != null
                        ? paymentPlan.trial_period_days
                        : 0
                    }
                    onChange={function() {}}
                    receiveOnChange
                    receiveValue
                  />

                  <Inputs
                    type="price"
                    name="amount"
                    label="Amount"
                    defaultValue={paymentPlan.amount}
                    onChange={function() {}}
                    receiveOnChange
                    receiveValue
                  />

                  <Inputs
                    type="select"
                    name="interval"
                    label="Interval"
                    defaultValue={paymentPlan.interval}
                    options={[
                      { Daily: "day" },
                      { Weekly: "week" },
                      { Monthly: "month" },
                      { Yearly: "year" },
                    ]}
                    onChange={function() {}}
                    receiveOnChange
                    receiveValue
                  />

                  {/* TODO: Stripe limits interval count to be 2 years */}
                  <Inputs
                    type="number"
                    name="interval_count"
                    label="Interval Count"
                    defaultValue={paymentPlan.interval_count}
                    onChange={function() {}}
                    receiveOnChange
                    receiveValue
                  />
                </div>
              </div>
            </div>

            <div
              id="request-submission-box"
              className="modal-footer text-right"
            >
              <Buttons
                containerClass="inline"
                btnType="primary"
                text="Submit"
                type="submit"
                value="submit"
              />
              <Buttons
                containerClass="inline"
                btnType="default"
                text="Close"
                onClick={this.props.onHide}
              />
            </div>
          </DataForm>
        </div>
      );
    }
    return (
      <div>
        <div className="p-20">
          <p>
            <strong>You do not have a payment plan setup.</strong>
          </p>
        </div>
        <div id="request-submission-box" className="modal-footer text-right">
          <Buttons btnType="default" text="Close" onClick={this.props.onHide} />
        </div>
      </div>
    );
  }
}

export default ServiceInstanceFormEdit;
