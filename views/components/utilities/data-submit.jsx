import React from "react";
import update from "immutability-helper";
import { connect } from "react-redux";
import Load from "./load.jsx";
import Fetcher from "./fetcher.jsx";
import { Authorizer, isAuthorized } from "./authorizer.jsx";
import Inputs from "./inputs.jsx";
import Buttons from "../elements/buttons.jsx";

const _ = require("lodash");

class DataSubmit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      templateData: null,
      formData: null,
      formURL: this.props.URL,
      formResponseData: null,
      loading: true,
    };
  }

  componentDidMount() {
    const self = this;
    Fetcher(self.state.formURL)
      .then(function(response) {
        if (!response.error) {
          self.setState({
            loading: false,
            templateData: response,
            formData: response,
          });
        } else {
          self.setState({ loading: false });
        }
      })
      .catch(function(err) {});
  }

  buildFormData(name, value, refName = null, refID = null) {
    if (refName && refID) {
      const refIndex = _.findIndex(this.state.formData.references[refName], [
        "id",
        refID,
      ]);
      const newData = update(this.state.formData, {
        references: { [refName]: { [refIndex]: { [name]: { $set: value } } } },
      });
      this.setState({ formData: newData });
    } else {
      const newData = update(this.state.formData, {
        [name]: { $set: value },
      });
      this.setState({ formData: newData });
    }
  }

  handleInputsChange(e = null, component) {
    if (e) {
      if (component.props.refName) {
        this.buildFormData(
          component.props.name,
          e.target.value,
          component.props.refName,
          component.props.refID,
        );
      } else {
        this.buildFormData(component.props.name, e.target.value);
      }
    }
  }

  handleSubmission() {
    const self = this;
    const payload = self.state.formData;

    self.setState({ ajaxLoad: true });

    Fetcher(this.state.formURL, "POST", payload).then(function(response) {
      if (!response.error) {
        self.setState({ ajaxLoad: false, success: true });
      } else {
        self.setState({ ajaxLoad: false });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    } 
      return (
        <div>
          {React.cloneElement(this.props.children, {
            haha: this.handleInputsChange,
          })}
        </div>
      );
    
  }
}

export default DataSubmit;
