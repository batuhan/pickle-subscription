import React from "react";
import { Link, browserHistory } from "react-router";
import Modal from "../../utilities/modal.jsx";
import Login from "../forms/login.jsx";

/**
 * Uses Modal.jsx component to house the content of this modal
 * Calls
 */
class ModalAddCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email || null,
    };
  }

  render() {
    const self = this;
    const pageName = "User Login";

    return (
      <Modal
        modalTitle={pageName}
        hideCloseBtn
        show={self.props.show}
        hide={this.props.hide}
        hideFooter
        width={this.props.width}
      >
        <div className="table-responsive">
          <Login
            hide={self.props.hide}
            email={this.state.email}
            invitationExists={this.props.invitationExists}
            modal
          />
        </div>
      </Modal>
    );
  }
}

export default ModalAddCategory;
