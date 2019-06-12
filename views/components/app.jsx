import React from "react";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import Fetcher from "./utilities/fetcher.jsx";
import NavBootstrap from "./layouts/nav-bootstrap.jsx";
import Footer from "./layouts/footer.jsx";
import {
  setUid,
  setUser,
  dismissAlert,
  setPermissions,
} from "./utilities/actions";
import { store } from "../store";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { backgroundColor: "#000000" };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {}

  handleLogout() {
    const that = this;

    Fetcher("/api/v1/auth/session/clear").then(function(result) {
      localStorage.removeItem("permissions");
      that.props.logout();
      browserHistory.push("/");
    });
  }

  render() {
    const self = this;
    const background =
      this.props.options && this.props.options.background_color
        ? this.props.options.background_color.value
        : "#ff0400";
    if (this.props.options && this.props.options.background_color) {
      document.getElementById("servicebot-loader").classList.add("move-out");
    }

    return (
      <div className="app-container" style={{ backgroundColor: background }}>
        {this.props.modal && this.props.modal}
        <NavBootstrap handleLogout={this.handleLogout} />
        {self.props.children}
        <Footer />
      </div>
    );
  }
}
const mapStateToProps = function(state) {
  return {
    options: state.options,
    modal: state.modal,
  };
};
const mapDispatchToProps = function(dispatch) {
  return {
    logout() {
      dispatch(setUid(null));
      dispatch(dismissAlert([]));
      dispatch(setUser(null));
      dispatch(setPermissions([]));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
