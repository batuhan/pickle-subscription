import React from "react";
import Modal from "../../utilities/modal.jsx";
import InviteUserForm from "../forms/invite-user-form.jsx";

/**
 * Uses Modal.jsx component to house the content of this modal
 * Calls
 */
class ModalInviteUser extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const self = this;
    const pageName = "Invite New User";

    return (
      <Modal
        modalTitle={pageName}
        icon="fa-user-plus"
        hideCloseBtn
        show={self.props.show}
        hide={self.props.hide}
        hideFooter
      >
        <div className="table-responsive">
          <InviteUserForm
            hide={self.props.hide}
            reinviteEmail={
              this.props.reinviteUser ? this.props.reinviteUser : null
            }
          />
        </div>
      </Modal>
    );
  }
}

export default ModalInviteUser;
