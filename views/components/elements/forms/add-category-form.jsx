import React from "react";
import { get, has } from "lodash";
import { ServicebotBaseForm, inputField } from "servicebot-base-form";
import { Field } from "redux-form";
import { required, email, numericality, length } from "redux-form-validators";

class AddCategoryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      loading: false,
      success: false,
    };
  }

  render() {
    let submissionRequest = {
      method: "POST",
      url: `/api/v1/service-categories`,
    };

    return (
      <div id="add-category-form">
        <ServicebotBaseForm
          form={categoryFormElements}
          // initialValues={{...this.state.personalInformation}}
          // submissionPrep={this.submissionPrep}
          submissionRequest={submissionRequest}
          // handleResponse={this.props.handleResponse}
          successMessage={"Card added successfully"}
        />
      </div>
    );
  }
}

function categoryFormElements(props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <Field
        name="name"
        type="text"
        validate={required()}
        component={inputField}
        label="Category Name"
      />
      <Field
        name="description"
        type="text"
        component={inputField}
        label="Description"
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default AddCategoryForm;
