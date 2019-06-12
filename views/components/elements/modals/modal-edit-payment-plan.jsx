import React from "react";
import { browserHistory } from "react-router";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import ServiceInstancePaymentFormEdit from "../forms/service-instance-payment-form-edit.jsx";
import Modal from "../../utilities/modal.jsx";

/**
 * Uses Modal.jsx component to house the content of this modal
 * Calls
 */
class ModalEditPaymentPlan extends React.Component {
  constructor(props) {
    super(props);
    const instance = this.props.myInstance;
    this.state = { instance };
  }

  render() {
    const self = this;
    const pageName = "Edit Payment Plan";

    return (
      <Modal
        modalTitle={pageName}
        icon="fa-credit-card-alt"
        hideCloseBtn
        show={self.props.show}
        hide={self.props.hide}
        hideFooter
      >
        <div className="table-responsive">
          <div className="row">
            <div className="col-xs-12">
              <ServiceInstancePaymentFormEdit
                myInstance={self.state.instance}
                onHide={self.props.hide}
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalEditPaymentPlan;
