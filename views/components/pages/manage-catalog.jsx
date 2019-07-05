import React from "react";
import { Link, hashHistory, browserHistory } from "react-router";
import { Authorizer, isAuthorized } from "../utilities/authorizer.jsx";
import Jumbotron from "../layouts/jumbotron.jsx";
import Content from "../layouts/content.jsx";
import DataTable from "../elements/datatable/datatable.jsx";

class ManageCatalog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!isAuthorized({ permissions: "can_administrate" })) {
      return browserHistory.push("/login");
    }
  }

  render() {
    let pageName = this.props.route.name;
    let subtitle = "Create and manage offerings";
    return (
      <Authorizer permissions="can_administrate">
        {this.props.children}
      </Authorizer>
    );
  }
}

export default ManageCatalog;
