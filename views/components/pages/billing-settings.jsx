import React from "react";
import cookie from "react-cookie";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import { Authorizer, isAuthorized } from "../utilities/authorizer.jsx";
import Jumbotron from "../layouts/jumbotron.jsx";
import Content from "../layouts/content.jsx";
import { BillingForm } from "../elements/forms/billing-settings-form.jsx";

class BillingSettings extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!isAuthorized({})) {
      return browserHistory.push("/login");
    }
  }

  render() {
    const pageName = this.props.route.name;
    const spk = cookie.load("spk");
    return (
      <Authorizer>
        <Jumbotron pageName={pageName} location={this.props.location} />
        <div className="page-service-instance">
          <Content>
            <div className="row m-b-20">
              <div className="col-md-10 col-lg-8 col-sm-12 col-md-offset-1 col-lg-offset-2">
                <BillingForm uid={this.props.uid} spk={spk} />
              </div>
            </div>
          </Content>
        </div>
      </Authorizer>
    );
  }
}

export default connect(state => ({
  uid: state.uid,
}))(BillingSettings);
