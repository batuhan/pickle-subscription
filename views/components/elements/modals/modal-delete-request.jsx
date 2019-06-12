import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from "../../utilities/modal.jsx";
import ModalPaymentSetup from "./modal-payment-setup.jsx";
import { Price } from "../../utilities/price.jsx";

const _ = require("lodash");

class ModalDeleteRequest extends React.Component {
  constructor(props) {
    super(props);
    const uid = cookie.load("uid");
    const username = cookie.load("username");
    const serviceInstance = this.props.myInstance;
    this.state = {
      loading: false,
      uid,
      email: username,
      serviceInstance,
      action_url: `/api/v1/service-instances/${serviceInstance.id}`,
      current_modal: "model_delete",
    };
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(event) {
    event.preventDefault();
    const self = this;
    self.setState({ loading: false });

    Fetcher(self.state.action_url, "DELETE", {}).then(function(response) {
      if (!response.error) {
        // check stripe response for error
        self.setState({
          loading: false,
          current_modal: "model_delete_success",
        });
      }
      self.setState({ loading: false });
    });
  }

  handleUnauthorized() {
    browserHistory.push("/login");
  }

  render() {
    const self = this;
    const pageName = "Service Approval";
    const currentModal = this.state.current_modal;
    const instance = this.state.serviceInstance;
    const {name} = instance;
    const price = instance.payment_plan.amount;
    const {interval} = instance.payment_plan;

    if (currentModal == "model_delete") {
      return (
        <Modal
          modalTitle={pageName}
          icon="fa-trash"
          show={self.props.show}
          hide={self.props.hide}
          hideFooter
          top="40%"
          width="490px"
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <strong>
                      You are about to delete the following service.
                    </strong>
                  </p>
                  <p>
                    Service: 
                    {' '}
                    {name}
, 
                    {' '}
                    <Price value={price} />
/
                    {interval}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer text-right p-b-20">
              <button
                className="btn btn-primary btn-rounded"
                onClick={self.onDelete}
              >
                Delete Request
              </button>
              <button
                className="btn btn-default btn-rounded"
                onClick={self.props.hide}
              >
                Nevermind
              </button>
            </div>
          </div>
        </Modal>
      );
    } if (currentModal == "model_delete_success") {
      return (
        <Modal
          modalTitle={pageName}
          show={self.props.show}
          hide={self.props.hide}
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <strong>This service request has been deleted.</strong>
                  </p>
                  <p>
Service:
                    {name}
                  </p>
                  <p>
                    Price: 
                    {' '}
                    <Price value={price} />
/
                    {interval}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      );
    }
  }
}

export default ModalDeleteRequest;
