import React from "react";
import { Link, hashHistory, browserHistory } from "react-router";
import { Authorizer, isAuthorized } from "../utilities/authorizer.jsx";
import Jumbotron from "../layouts/jumbotron.jsx";
import Content from "../layouts/content.jsx";
import ContentTitle from "../layouts/content-title.jsx";
import StripeSettingsForm from "../elements/forms/stripe-settings-form.jsx";
import StripeImportForm from "../elements/forms/stripe-import-form.jsx";

class StripeSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!isAuthorized({ permissions: "can_administrate" })) {
      return browserHistory.push("/login");
    }
  }

  render() {
    return (
      <Authorizer permissions="can_administrate">
        <div className="app-content __manage-stripe-settings">
          <Content>
            <div className={`_title-container`}>
              <h1 className={`_heading`}>Manage Stripe Settings</h1>
            </div>
            <StripeSettingsForm />
          </Content>
        </div>
      </Authorizer>
    );
  }
}

export default StripeSettings;
