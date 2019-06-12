import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import { Authorizer, isAuthorized } from "../../utilities/authorizer.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from "../../utilities/modal.jsx";

class ModalRequestCancellation extends React.Component {
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
      delete_url: `/api/v1/service-instances/${serviceInstance.id}`,
      current_modal: "model_delete",
    };
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(event) {
    event.preventDefault();
    const self = this;
    Fetcher(self.state.delete_url, "DELETE", {}).then(function(response) {
      if (!response.error) {
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
    const currentModal = this.state.current_modal;
    const instance = self.state.serviceInstance;
    const {name} = instance;

    if (currentModal === "model_delete") {
      if (isAuthorized({ permissions: ["can_administrate", "can_manage"] })) {
        return (
          <Modal
            modalTitle="Cancel Service"
            icon="fa-ban"
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
                        Are you sure you want to delete this service?
                      </strong>
                    </p>
                    <p>
                      Deleting a service will permanently remove the service
                      from the system along with all attached records such as
                      charges, properties, and invoices attached to this
                      service!
                    </p>
                    <p>
                      Service Name: 
                      {' '}
                      <b>{name}</b>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer text-right p-b-20">
                <button
                  className="btn btn-default btn-rounded"
                  onClick={self.props.hide}
                >
                  Nevermind
                </button>
                <button
                  className="btn btn-danger btn-rounded"
                  onClick={self.onDelete}
                >
                  Delete Service
                </button>
              </div>
            </div>
          </Modal>
        );
      } 
        return (
          <div>You do not have the permission to access this feature.</div>
        );
      
    } if (currentModal === "model_delete_success") {
      return (
        <Modal
          modalTitle="Service Cancellation Successful"
          icon="fa-check"
          show={self.props.show}
          hide={self.props.hide}
        >
          <div className="table-responsive">
            <div className="p-20">
              <div className="row">
                <div className="col-xs-12">
                  <p>
                    <strong>
                      Service 
                      {' '}
                      {name}
, has been successfully deleted.
                    </strong>
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

export default ModalRequestCancellation;
