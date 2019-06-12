import React from "react";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Alerts from "../alerts.jsx";
import Buttons from "../buttons.jsx";

const _ = require("lodash");

class SuspendUserForm extends React.Component {
  constructor(props) {
    super(props);
    const { uid } = this.props;
    this.state = {
      url: `/api/v1/users/${uid}/suspend`,
      response: {},
      alerts: {},
      loading: false,
      success: false,
    };

    this.fetchSuspendUser = this.fetchSuspendUser.bind(this);
  }

  fetchSuspendUser() {
    const self = this;
    Fetcher(this.state.url, "POST").then(function(response) {
      if (!response.error) {
        self.setState({ success: true, response });
      } else {
        console.error("error suspending user", response);
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    }
    if (this.state.success) {
      return (
        <div>
          <div className="p-20">
            <p>
              <strong>Suspend User Success!</strong>
            </p>
          </div>
          <div className="modal-footer text-right p-b-20">
            <Buttons
              containerClass="inline"
              btnType="default"
              text="Done"
              onClick={this.props.hide}
            />
          </div>
        </div>
      );
    }
    // TODO: Add validation functions and pass into DataForm as props
    return (
      <div className="suspend-user-form">
        {this.state.alerts && this.state.alerts.message && (
          <div>
            <Alerts
              type={this.state.alerts.type}
              message={this.state.alerts.message}
            />
          </div>
        )}

        <div className="p-20">
          <p>
            <strong>Are you sure you want to suspend this user?</strong>
          </p>
        </div>

        <div className="modal-footer text-right p-b-20">
          <Buttons
            containerClass="inline"
            btnType="primary"
            text="Suspend User"
            success={this.state.success}
            onClick={this.fetchSuspendUser}
          />
          <Buttons
            containerClass="inline"
            btnType="default"
            text="Cancel"
            onClick={this.props.hide}
          />
        </div>
      </div>
    );
  }
}

export default SuspendUserForm;
