import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import Fetcher from "../../utilities/fetcher.jsx";
import { Authorizer, isAuthorized } from "../../utilities/authorizer.jsx";
import Modal from "../../utilities/modal.jsx";
import { Price } from "../../utilities/price.jsx";

const _ = require("lodash");

class ModalManageCancellation extends React.Component {
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
      undo_cancel_url: false,
      confirm_cancel_url: false,
      reject_cancel_url: false,
      current_modal: "model_undo_cancel",
    };
    this.onUndoCancel = this.onUndoCancel.bind(this);
    this.onConfirmCancel = this.onConfirmCancel.bind(this);
    this.onRejectCancel = this.onRejectCancel.bind(this);
  }

  componentDidMount() {
    const self = this;
    const service_instance = self.props.myInstance;
    if (service_instance.references.service_instance_cancellations.length > 0) {
      const cancellationID =
        service_instance.references.service_instance_cancellations[0].id;
      self.setState({
        undo_cancel_url: `/api/v1/service-instance-cancellations/${cancellationID}/undo`,
        confirm_cancel_url: `/api/v1/service-instance-cancellations/${cancellationID}/approve`,
        reject_cancel_url: `/api/v1/service-instance-cancellations/${cancellationID}/reject`,
      });
    }
  }

  onUndoCancel(event) {
    event.preventDefault();
    const self = this;
    self.setState({ loading: false });

    Fetcher(self.state.undo_cancel_url, "POST", {}).then(function(response) {
      if (!response.error) {
        self.setState({
          loading: false,
          current_modal: "model_undo_cancel_success",
        });
      }
      self.setState({ loading: false });
    });
  }

  onConfirmCancel(event) {
    event.preventDefault();
    const self = this;
    self.setState({ loading: false });

    Fetcher(self.state.confirm_cancel_url, "POST", {}).then(function(response) {
      if (!response.error) {
        self.setState({
          loading: false,
          current_modal: "model_confirm_cancel_success",
        });
      }
      self.setState({ loading: false });
    });
  }

  onRejectCancel(event) {
    event.preventDefault();
    const self = this;
    self.setState({ loading: false });

    Fetcher(self.state.reject_cancel_url, "POST", {}).then(function(response) {
      if (!response.error) {
        self.setState({
          loading: false,
          current_modal: "model_reject_cancel_success",
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
    const currentModal = this.state.current_modal;
    const instance = self.state.serviceInstance;
    const { name } = instance;
    const price = instance.payment_plan.amount;
    const { interval } = instance.payment_plan;
    const success_icon = "fa-check";

    if (currentModal == "model_undo_cancel") {
      if (isAuthorized({ permissions: ["can_administrate", "can_manage"] })) {
        return (
          <Modal
            modalTitle="Manage Cancellation Request"
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
                      <b>
                        There is a pending cancellation request for this
                        service.
                      </b>
                    </p>
                    <ul>
                      <li>Approve to cancel the service</li>
                      <li>Reject to keep the service running</li>
                    </ul>
                    <p>
                      Once approved, all future payments will be cancelled
                      automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer text-right p-b-20">
                <button
                  className="btn btn-default btn-rounded"
                  onClick={self.props.hide}
                >
                  Close
                </button>
                <button
                  className="btn btn-danger btn-rounded"
                  onClick={self.onRejectCancel}
                >
                  Reject
                </button>
                <button
                  className="btn btn-primary btn-rounded"
                  onClick={self.onConfirmCancel}
                >
                  Approve
                </button>
              </div>
            </div>
          </Modal>
        );
      }
      return (
        <Modal
          modalTitle="Service Cancellation Request"
          icon="fa-flag"
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
                      Your service cancellation request is pending approval.
                    </strong>
                  </p>
                  <p>
                    Once your request has been processed, you will be notified.
                    You can undo cancellation to keep your service running.
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer text-right p-b-20">
              <button
                className="btn btn-default btn-rounded"
                onClick={self.props.hide}
              >
                Close
              </button>
              <button
                className="btn btn-default btn-rounded"
                onClick={self.onUndoCancel}
              >
                Undo Request
              </button>
            </div>
          </div>
        </Modal>
      );
    }
    if (currentModal == "model_undo_cancel_success") {
      return (
        <Modal
          modalTitle="Reverted Cancellation Request"
          icon="fa-check"
          show={self.props.show}
          hide={self.props.hide}
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <b>
                      You have successfully reverted your cancellation request.
                      Your service is back to original state.
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      );
    }
    if (currentModal == "model_reject_cancel_success") {
      return (
        <Modal
          modalTitle="Cancellation Request is Rejected"
          icon="fa-times"
          show={self.props.show}
          hide={self.props.hide}
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <strong>
                      You have successfully rejected the service cancellation
                      request. The customer will be notified.
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      );
    }
    if (currentModal == "model_confirm_cancel_success") {
      return (
        <Modal
          modalTitle="Cancellation Request is Approved"
          icon="fa-check"
          show={self.props.show}
          hide={self.props.hide}
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <b>
                      You have successfully approved the service cancellation
                      request. The customer will be notified.
                    </b>
                  </p>
                  <p>
                    Customer's automatic payment is now cancelled for this
                    service.
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

export default ModalManageCancellation;
