import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from "../../utilities/modal.jsx";
import ModalPaymentSetup from "./modal-payment-setup.jsx";
import { Price } from "../../utilities/price.jsx";
import Alerts from "../alerts.jsx";
import Buttons from "../buttons.jsx";
import { Authorizer, isAuthorized } from "../../utilities/authorizer.jsx";

const _ = require("lodash");

class ModalApprove extends React.Component {
  constructor(props) {
    super(props);
    // if loaded from the approve modal, it should take a prop for the instance's owner's uid and use that instead of current logged in your's uid.
    let uid = cookie.load("uid");
    if (this.props.owner) {
      uid = this.props.owner;
    }
    const username = cookie.load("username");
    const serviceInstance = this.props.myInstance;
    this.state = {
      loading: false,
      uid,
      email: username,
      serviceInstance,
      approve_instance_url:
        serviceInstance.status === "cancelled"
          ? `/api/v1/service-instances/${serviceInstance.id}/reactivate`
          : `/api/v1/service-instances/${serviceInstance.id}/approve`,
      approved: false,
      current_modal: "model_approve",
      ajaxLoad: false,
      hasCard: false,
      fund: {},
      card: {},
    };
    this.fetcherUserPaymentInfo = this.fetcherUserPaymentInfo.bind(this);
    this.handlePaymentSetup = this.handlePaymentSetup.bind(this);
    this.onPaymentSetupClose = this.onPaymentSetupClose.bind(this);
    this.onApprove = this.onApprove.bind(this);
  }

  componentWillMount() {
    // checks if user has a card before mount
    this.fetcherUserPaymentInfo();
  }

  fetcherUserPaymentInfo() {
    const self = this;
    // try and fetch user's card info from our database
    // changed so the user being checked is the owner of the instance
    Fetcher(`/api/v1/users/${self.state.serviceInstance.user_id}`).then(
      function(response) {
        if (!response.error) {
          // if user has card on record
          if (
            _.has(response, "references.funds[0]") &&
            _.has(response, "references.funds[0].source.card")
          ) {
            const fund = _.get(response, "references.funds[0]");
            const card = _.get(response, "references.funds[0].source.card");
            self.setState({
              loading: false,
              hasCard: true,
              paymentSetupModal: false,
              current_modal: "model_approve",
              fund,
              card,
            });
          }
        } else {
          self.setState({ loading: false, hasCard: false });
        }
      },
    );
  }

  handlePaymentSetup() {
    this.setState({ current_modal: "payment_setup", paymentSetupModal: true });
  }

  onPaymentSetupClose() {
    this.fetcherUserPaymentInfo();
    this.setState({ current_modal: "model_approve", paymentSetupModal: false });
  }

  onApprove(event) {
    event.preventDefault();
    const self = this;
    const instance = self.state.serviceInstance;
    self.setState({ loading: false });
    if (
      !self.state.hasCard &&
      (instance.payment_plan.trial_period_days === 0 ||
        instance.payment_plan.trial_period_days === null)
    ) {
      self.handlePaymentSetup();
    } else {
      self.setState({ ajaxLoad: true });
      Fetcher(self.state.approve_instance_url, "POST", {}).then(function(
        response,
      ) {
        if (!response.error) {
          // check stripe response for error
          if (response.type == "StripeInvalidRequestError") {
            // check what error it is
            self.setState({ ajaxLoad: false }, () => {
              // make sure stripe has card and db has card
              if (
                response.message ==
                "This customer has no attached payment source"
              ) {
                self.handlePaymentSetup();
              } else {
                self.setState({
                  alerts: {
                    type: "danger",
                    message:
                      response.message ||
                      response.err ||
                      response.err.err ||
                      response.error ||
                      response,
                    icon: "exclamation-circle",
                  },
                });
              }
            });
          } else {
            self.setState({ loading: false, approved: true });
          }
        }
        self.setState({ loading: false });
      });
    }
  }

  handleUnauthorized() {
    browserHistory.push("/login");
  }

  render() {
    const self = this;
    const pageName = "Payment Approval";
    const icon = "fa-credit-card-alt";
    const currentModal = this.state.current_modal;
    const instance = this.state.serviceInstance;
    const { name } = instance;
    const price = instance.payment_plan.amount;
    const { interval } = instance.payment_plan;
    const charges = instance.references.charge_items;
    const unpaidCharges = _.filter(charges, item => {
      return !item.approved;
    });
    let totalCharges = 0;
    const { options } = this.props;
    const prefix = options.currency
      ? getSymbolFromCurrency(options.currency.value)
      : "";
    unpaidCharges.map(charge => {
      totalCharges += charge.amount;
    });

    const getAlerts = () => {
      if (self.state.alerts) {
        if (isAuthorized({ permissions: ["can_administrate", "can_manage"] })) {
          return (
            <Alerts
              type={self.state.alerts.type}
              message={self.state.alerts.message}
              position={{ position: "fixed", bottom: true }}
              icon="exclamation-circle"
            />
          );
        }
        return (
          <Alerts
            type={self.state.alerts.type}
            message="System Error: Please contact admin for assistance."
            position={{ position: "fixed", bottom: true }}
            icon="exclamation-circle"
          />
        );
      }
    };

    const getSubscriptionPrice = () => {
      if (instance.payment_plan.amount > 0) {
        return <Price value={price} prefix={prefix} /> / { interval };
      }
    };

    if (currentModal === "model_approve" && !self.state.approved) {
      return (
        <Modal
          modalTitle={pageName}
          icon={icon}
          show={self.props.show}
          hide={self.props.hide}
          hideFooter
          top="40%"
          width="550px"
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  {getAlerts()}
                  <p>
                    <strong>
                      You are about to pay for the following item:
                    </strong>
                  </p>
                  <p>
                    Item Name:
                    {name}
                  </p>
                  <p>
                    <strong>
                      Total Charges: &nbsp;
                      <ul>
                        <li>
                          {instance.payment_plan.amount > 0 && (
                            <span>
                              <Price value={price} prefix={prefix} /> /{" "}
                              {interval}
                            </span>
                          )}
                        </li>
                        <li>
                          {totalCharges > 0 && (
                            <span>
                              <Price value={totalCharges} prefix={prefix} />
                            </span>
                          )}
                        </li>
                      </ul>
                    </strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer text-right p-b-20">
              <Buttons
                containerClass="inline"
                btnType="primary"
                text="Confirm Payment"
                onClick={self.onApprove}
                loading={self.state.ajaxLoad}
              />
              <Buttons
                containerClass="inline"
                btnType="default"
                text="Later"
                onClick={self.props.hide}
              />
            </div>
          </div>
        </Modal>
      );
    }
    if (currentModal === "model_approve" && self.state.approved) {
      return (
        <Modal
          modalTitle={pageName}
          icon={icon}
          show={self.props.show}
          hide={self.props.hide}
          top="40%"
          width="550px"
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <strong>
                      You have successfully approved and paid for this item!
                    </strong>
                  </p>
                  <p>
                    Service Name:
                    {name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      );
    }
    if (currentModal == "payment_setup") {
      return (
        <ModalPaymentSetup
          modalCallback={self.onPaymentSetupClose}
          ownerId={instance.user_id}
          show={self.state.paymentSetupModal}
          hide={self.onPaymentSetupClose}
        />
      );
    }
  }
}

ModalApprove = connect(state => {
  return {
    options: state.options,
  };
})(ModalApprove);

export default ModalApprove;
