import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from "../../utilities/modal.jsx";
import { BillingForm } from "../forms/billing-settings-form.jsx";
import Buttons from "../buttons.jsx";

/**
 * Uses Modal.jsx component to house the content of this modal
 * Renders BillingSettingForm component
 */
class ModalPaymentSetup extends React.Component {
  constructor(props) {
    super(props);
    const currentUserId = cookie.load("uid");
    let uid = currentUserId;

    if (this.props.ownerId) {
      uid = this.props.ownerId;
    }

    this.state = {
      form: "credit_card",
      ownerId: uid,
      currentUserId,
    };

    this.handleCreditCard = this.handleCreditCard.bind(this);
    this.handleBankAccount = this.handleBankAccount.bind(this);
    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleModalCallback = this.handleModalCallback.bind(this);
    this.getModalMessageTitle = this.getModalMessageTitle.bind(this);
  }

  handleUnauthorized() {
    browserHistory.push("/login");
  }

  handleCreditCard() {
    this.setState({ form: "credit_card" });
  }

  handleBankAccount() {
    this.setState({ form: "bank_account" });
  }

  handleBackBtn() {
    this.setState({ form: "" });
  }

  handleResponse(response) {
    if (response.created || response.data) {
      this.handleModalCallback(response);
    }
  }

  handleModalCallback(response) {
    if (this.props.modalCallback) {
      this.props.modalCallback(response);
    }
  }

  getModalMessageTitle() {
    if (this.props.message) {
      return this.props.message.title;
    } 
      if (this.state.currentUserId === this.state.ownerId) {
        return `Looks like you don't have a payment source in your account, let's setup your payment here first.`;
      } 
        return `Looks like this user doesn't have a payment source in their account, let's setup a payment for them first.`;
      
    
  }

  getModalMessageBody() {
    if (this.props.message) {
      return this.props.message.body;
    } 
      return "You will be returned to your approval page once your payment is setup.";
    
  }

  render() {
    const self = this;
    const pageName = "Payment Setup";
    const icon = "fa-credit-card-alt";
    const spk = cookie.load("spk");

    if (self.props.justPayment) {
      return (
        <Modal
          modalTitle={pageName}
          icon={icon}
          hideCloseBtn
          show={self.props.show}
          hide={self.props.hide}
          hideFooter
          width="700px"
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  {self.state.form === "credit_card" && (
                    <div>
                      <BillingForm
                        spk={spk}
                        uid={self.state.ownerId}
                        handleResponse={self.handleResponse}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      );
    } 
      return (
        <Modal
          modalTitle={pageName}
          icon={icon}
          hideCloseBtn
          show={self.props.show}
          hide={self.props.hide}
          hideFooter
          width="700px"
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  {self.state.form === "credit_card" && (
                    <div>
                      <BillingForm
                        spk={spk}
                        uid={self.state.ownerId}
                        handleResponse={self.handleResponse}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer text-right p-b-20">
              {self.state.form === "credit_card" ? (
                <Buttons
                  text="Back"
                  btnType="default"
                  onClick={self.handleBackBtn}
                />
              ) : (
                <div>
                  <Buttons
                    containerClass="inline"
                    btnType="primary"
                    text="Add Credit Card"
                    onClick={self.handleCreditCard}
                  />
                  <Buttons
                    containerClass="inline"
                    btnType="default"
                    text="Cancel"
                    onClick={self.props.hide}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>
      );
    
  }
}

export default ModalPaymentSetup;
