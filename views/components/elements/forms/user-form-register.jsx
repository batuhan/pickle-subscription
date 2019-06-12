import React from "react";
import { Link, browserHistory } from "react-router";
import { connect } from "react-redux";
import cookie from "react-cookie";
import Load from "../../utilities/load.jsx";
import { DataForm } from "../../utilities/data-form.jsx";
import {
  setUid,
  fetchUsers,
  setUser,
  setPermissions,
} from "../../utilities/actions";
import Inputs from "../../utilities/inputs.jsx";

const _ = require("lodash");

class UserFormRegister extends React.Component {
  constructor(props) {
    super(props);
    const { token } = this.props;
    this.state = {
      token,
      url: token
        ? `/api/v1/users/register?token=${token}`
        : `/api/v1/users/register`,
      loading: false,
      success: false,
    };
    this.handleResponse = this.handleResponse.bind(this);
    this.getValidators = this.getValidators.bind(this);
  }

  handleResponse(response) {
    if (!response.error) {
      localStorage.setItem("permissions", response.permissions);
      this.props.setUid(cookie.load("uid"));
      this.props.setUser(cookie.load("uid"));
      this.props.setPermissions(response.permissions);

      this.setState({ success: true });

      if (this.props.location.state && this.props.location.state.fromLogin) {
        return browserHistory.push("/my-services");
      }
      return browserHistory.push("/my-services");
    }
  }

  getValidators() {
    // optional references: the service template's references.service_template_properties
    // Defining general validators
    const isEmpty = val => {
      return val === "" || typeof val === "undefined";
    };
    // Defining field validators
    const validateEmail = val => {
      const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (isEmpty(val)) {
        return { error: "Email is required!" };
      }
      if (!val.match(mailFormat)) {
        return { error: "Invalid email format!" };
      }
      return true;
    };
    const validateName = val => {
      if (isEmpty(val)) {
        return { error: "Name is required!" };
      }
      return true;
    };
    const validatePhone = val => {
      if (isEmpty(val)) {
        return { error: "Phone is required!" };
      }
      return true;
    };
    const validatePassword = val => {
      if (isEmpty(val)) {
        return { error: "Password is required!" };
      }
      return true;
    };

    const validatorJSON = {
      name: validateName,
      phone: validatePhone,
      email: validateEmail,
      password: validatePassword,
    };
    return validatorJSON;
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    }
    if (this.state.success) {
      return browserHistory.push("/my-services");
    }
    // TODO: Add validation functions and pass into DataForm as props
    return (
      <div className="sign-up">
        <DataForm
          validators={this.getValidators()}
          handleResponse={this.handleResponse}
          url={this.state.url}
          method="POST"
        >
          {/* <img className="login-brand" src="/assets/logos/brand-logo-dark.png"/> */}
          {this.state.token ? (
            <div>
              <h3 className="m-b-20">Finish Your Invitation</h3>
              <p>Please enter your information to finish the invitation</p>
            </div>
          ) : (
            <div>
              <h3 className="m-b-20">Sign up</h3>
              <p>
                Enter your information to sign up. You can manage your purchases
                once you finish signing up.
              </p>
            </div>
          )}

          <Inputs
            type="text"
            name="name"
            placeholder="Name"
            hideLabel
            onChange={function() {}}
            receiveOnChange
            receiveValue
          />

          {!this.state.token && (
            <Inputs
              type="email"
              name="email"
              hideLabel
              placeholder="Email Address"
              onChange={function() {}}
              receiveOnChange
              receiveValue
            />
          )}

          <Inputs
            type="password"
            name="password"
            placeholder="Password"
            hideLabel
            onChange={function() {}}
            receiveOnChange
            receiveValue
          />

          {!this.state.token ? (
            <div>
              <button
                className="btn btn-raised btn-lg btn-primary btn-block"
                type="submit"
                value="submit"
              >
                Sign Up
              </button>
              <p className="sign-up-link p-t-15">
                I have an account{" "}
                <Link
                  className="sign-up-link"
                  to={{
                    pathname: "/login",
                    state: { fromSignup: true },
                  }}
                >
                  Login Here
                </Link>
              </p>
            </div>
          ) : (
            <button
              className="btn btn-raised btn-lg btn-primary btn-block"
              type="submit"
              value="submit"
            >
              Finish
            </button>
          )}
        </DataForm>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUid: uid => {
      dispatch(setUid(uid));
    },
    setUser: uid => {
      fetchUsers(uid, (err, user) => dispatch(setUser(user)));
    },
    setPermissions: permissions => dispatch(setPermissions(permissions)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(UserFormRegister);
