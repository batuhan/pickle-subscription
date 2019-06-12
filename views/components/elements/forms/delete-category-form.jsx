import React from "react";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Alerts from "../alerts.jsx";
import Buttons from "../buttons.jsx";

const _ = require("lodash");

class DeleteCategoryForm extends React.Component {
  constructor(props) {
    super(props);
    const {id} = this.props;
    this.state = {
      url: `/api/v1/service-categories/${id}`,
      response: {},
      alerts: {},
      loading: false,
      success: false,
    };

    this.fetchDeleteCategory = this.fetchDeleteCategory.bind(this);
  }

  fetchDeleteCategory() {
    const self = this;
    Fetcher(this.state.url, "DELETE").then(function(response) {
      if (!response.error) {
        self.setState({ success: true, response });
      } else {
        const msg =
          "Cannot delete a category that has service templates attached to it.";
        self.setState({
          alerts: {
            type: "danger",
            icon: "times",
            message: `${response.error} : ${msg}`,
          },
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    } if (this.state.success) {
      return (
        <div>
          <div className="p-20">
            <p>
              <strong>Delete Category Success!</strong>
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
          <div className="p-20">
            {this.state.alerts && this.state.alerts.message && (
              <div>
                <Alerts
                  type={this.state.alerts.type}
                  message={this.state.alerts.message}
                />
              </div>
            )}
            <p>
              <strong>Are you sure you want to delete this Category?</strong>
            </p>
          </div>

          <div className="modal-footer text-right p-b-20">
            <Buttons
              containerClass="inline"
              btnType="primary"
              text="Delete Category"
              success={this.state.success}
              onClick={this.fetchDeleteCategory}
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

export default DeleteCategoryForm;
