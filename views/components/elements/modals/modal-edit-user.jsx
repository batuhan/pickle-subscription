import React from "react";
import Modal from "../../utilities/modal.jsx";
import UserFormEdit from "../forms/user-form-edit.jsx";

/**
 * Uses Modal.jsx component to house the content of this modal
 * Calls
 */
class ModalEditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: this.props.myUser };
  }

  render() {
    const self = this;
    const pageName = "Edit User";

    return (
      <Modal
        modalTitle={pageName}
        hideCloseBtn
        show={self.props.show}
        hide={self.props.hide}
        hideFooter
      >
        <div className="table-responsive">
          <div className="row">
            <div className="col-xs-12">
              <UserFormEdit
                myInstance={self.state.user}
                onHide={self.props.hide}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalEditUser;
