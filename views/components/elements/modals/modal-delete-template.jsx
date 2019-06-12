import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from "../../utilities/modal.jsx";
import Alerts from "../alerts.jsx";

class ModalDeleteTemplate extends React.Component {
  constructor(props) {
    super(props);
    const {templateObject} = this.props;
    this.state = {
      loading: true,
      template: templateObject,
      template_id: templateObject.id,
      action_url: `/api/v1/service-templates/${templateObject.id}`,
      current_modal: "modal_action",
      alerts: {},
    };
    this.onDelete = this.onDelete.bind(this);
    this.fetchTemplate = this.fetchTemplate.bind(this);
  }

  componentDidMount() {
    this.fetchTemplate();
  }

  fetchTemplate() {
    const self = this;
    Fetcher(
      `/api/v1/service-templates/${self.state.template_id}`,
      "GET",
      {},
    ).then(function(response) {
      if (!response.error) {
        self.setState({ loading: false, template: response });
      } else {
        console.error(
          "failed called api delete",
          `/api/v1/service-templates/${self.state.template_id}`,
        );
      }
      self.setState({ loading: false });
    });
  }

  onDelete(event) {
    const self = this;
    event.preventDefault();
    self.setState({ loading: false });
    Fetcher(self.state.action_url, "DELETE", {}).then(function(response) {
      if (!response.error) {
        self.setState({
          loading: false,
          current_modal: "modal_action_success",
        });
      } else {
        self.setState({
          loading: false,
          alerts: {
            type: "danger",
            icon: "times",
            message: "Service template has attached instances. Cannot delete!",
          },
        });
      }
    });
  }

  handleUnauthorized() {
    browserHistory.push("/login");
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    } 
      const self = this;
      const pageName = "Delete a Service";
      const pageMessage = "delete";
      const actionFunction = this.onDelete;
      const currentModal = self.state.current_modal;
      const {template} = self.state;
      const {name} = template;
      const {description} = template;
      const status = template.published;

      if (currentModal == "modal_action") {
        return (
          <Modal
            modalTitle={pageName}
            show={self.props.show}
            hide={self.props.hide}
            hideFooter
            top="40%"
            width="490px"
          >
            <div className="table-responsive">
              <div className="p-20">
                {this.state.alerts && this.state.alerts.message && (
                  <div>
                    <Alerts
                      type={this.state.alerts.type}
                      message={this.state.alerts.message}
                    />
                  </div>
                )}
                <div className="row">
                  <div className="col-xs-12">
                    <p>
                      <strong>
                        You are about to 
                        {' '}
                        {pageMessage}
                        {' '}
the following service.
                      </strong>
                    </p>
                    <ul>
                      <li>
Service:
                        {name}
                      </li>
                      <li>
Description:
                        {description}
                      </li>
                      <li>
Status:
                        {status ? "Published" : "Unpublished"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer text-right p-b-20">
                <button
                  className="btn btn-primary btn-rounded"
                  onClick={actionFunction}
                >
                  <span className="capitalize">{pageMessage}</span>
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
      } if (currentModal == "modal_action_success") {
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
                      <strong>
                        You have successfully 
                        {' '}
                        {pageMessage} 
                        {' '}
                        {name}
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

export default ModalDeleteTemplate;
