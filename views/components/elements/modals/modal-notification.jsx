import React from "react";
import { browserHistory } from "react-router";
import cookie from "react-cookie";
import { connect } from "react-redux";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Modal from "../../utilities/modal.jsx";
import DateFormat from "../../utilities/date-format.jsx";
import { Price } from "../../utilities/price.jsx";

const _ = require("lodash");

class ModalNotification extends React.Component {
  constructor(props) {
    super(props);
  }

  createMarkup(html) {
    return { __html: html };
  }

  render() {
    const pageName = "Notification Message";
    const { notification } = this.props;

    return (
      <Modal modalTitle={pageName} hide={this.props.hide} icon="fa-bell">
        <div className="p-20">
          <p>
            <strong>{notification.subject}</strong>
          </p>
          <div
            dangerouslySetInnerHTML={this.createMarkup(notification.message)}
          />
        </div>
      </Modal>
    );
  }
}

export default ModalNotification;
