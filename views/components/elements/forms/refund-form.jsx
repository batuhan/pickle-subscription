import React from "react";
import Load from "../../utilities/load.jsx";
import Inputs from "../../utilities/inputs.jsx";
import { DataForm } from "../../utilities/data-form.jsx";
import Buttons from "../buttons.jsx";
import Alerts from "../alerts.jsx";
import { Price } from "../../utilities/price.jsx";
import DateFormat from "../../utilities/date-format.jsx";
import { Fetcher } from "servicebot-base-form";
let _ = require("lodash");
import {
  ServicebotBaseForm,
  inputField,
  priceField,
  selectField,
} from "servicebot-base-form";
import { Field } from "redux-form";
import { numericality, required } from "redux-form-validators";

function Refund(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        name={"amount"}
        component={priceField}
        type={"number"}
        isCents={true}
        label="Refund Amount"
        validate={numericality({ ">": 50, msg: "must be greater than $0.50" })}
      />
      <Field
        name={"reason"}
        id={`refund-reason`}
        component={selectField}
        options={[
          { id: "duplicate", name: "Duplicate" },
          { id: "fraudulent", name: "Fraudulent" },
          { id: "requested_by_customer", name: "Requested by customer" },
        ]}
        label="Refund Reason"
        validate={required()}
      />

      <button className="buttons _primary" type="submit">
        Submit
      </button>
    </form>
  );
}

class RefundForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: this.props.invoice || {},
      refundURL: `/api/v1/invoices/${this.props.invoice.id}/refund`,
      loading: false,
      success: false,
    };
    this.handleResponse = this.handleResponse.bind(this);
    this.fetchInvoice = this.fetchInvoice.bind(this);
  }

  componentDidMount() {
    this.fetchInvoice();
  }

  fetchInvoice() {
    Fetcher(`/invoices/${this.state.invoice.id}`).then(function(response) {
      if (!response.error) {
        this.setState({ loading: false, invoice: response });
      } else {
        console.error("error", response);
      }
    });
  }

  handleResponse(response) {
    console.log(response);
    if (
      _.has(response, "data.status") &&
      _.get(response, "data.status") === "succeeded"
    ) {
      this.setState({
        success: true,
        response: response.data,
        alerts: {
          type: "success",
          message: "Refund succeeded!",
        },
      });
    } else {
      if (response.type === "StripeInvalidRequestError") {
        this.setState({
          alerts: {
            type: "danger",
            message: response.message,
            icon: "exclamation-circle",
          },
        });
      } else if (response.error) {
        this.setState({
          alerts: {
            type: "danger",
            message: response.error.message,
            icon: "exclamation-circle",
          },
        });
      } else if (response == null) {
        this.setState({
          alerts: {
            type: "danger",
            message: "Response is null",
            icon: "exclamation-circle",
          },
        });
      } else {
        this.setState({
          alerts: {
            type: "danger",
            message: "Other error",
            icon: "exclamation-circle",
          },
        });
      }
    }
  }

  render() {
    let submissionRequest = {
      method: "POST",
      url: this.state.refundURL,
    };

    if (this.state.loading) {
      return <Load />;
    } else if (this.state.success) {
      return (
        <div>
          <div className="p-20">
            {this.state.alerts && (
              <Alerts
                type={this.state.alerts.type}
                message={this.state.alerts.message}
              />
            )}
          </div>
          <table className="table table-striped table-hover condensed">
            <thead>
              <tr>
                <td>ID</td>
                <td>Reason</td>
                <td>Status</td>
                <td>Date</td>
                <td className={`__right`}>Amount Refunded</td>
              </tr>
            </thead>
            <tbody>
              {this.state.response.refunds.data.map(item => (
                <tr key={`refund-id-${item.id}`}>
                  <td>{item.id}</td>
                  <td>{item.reason}</td>
                  <td>{item.status}</td>
                  <td>
                    <DateFormat time date={item.created} />
                  </td>
                  <td className={`__right`}>
                    <Price value={item.amount} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="invoice-footer">
              <tr>
                <td />
                <td />
                <td />
                <td>Total Refunded:</td>
                <td className={`__right`}>
                  <Price value={this.state.response.amount_refunded} />
                </td>
              </tr>
            </tfoot>
          </table>
          <div className={`modal-footer text-right p-b-20`}>
            <Buttons
              containerClass="inline"
              btnType="default"
              text="Done"
              onClick={this.props.hide}
            />
          </div>
        </div>
      );
    } else {
      //TODO: Add validation functions and pass into DataForm as props
      return (
        <div className="refund-form">
          {this.state.alerts && (
            <div className="p-20">
              <Alerts
                type={this.state.alerts.type}
                message={this.state.alerts.message}
                icon={this.state.alerts.icon}
              />
            </div>
          )}

          <ServicebotBaseForm
            form={Refund}
            formName={"REFUND_FORM"}
            // initialValues={{...paymentPlan, trial_period_days: 0}}
            submissionRequest={submissionRequest}
            handleResponse={this.handleResponse}
          />
        </div>
      );
    }
  }
}

export default RefundForm;
