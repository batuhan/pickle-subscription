import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { connect } from "react-redux";
import { hideModal } from "./actions";

const _ = require("lodash");

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.escFunction = this.escFunction.bind(this);
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.hide && this.props.hide(event);
      this.props.hideModal();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  hide(event) {
    this.props.hide && this.props.hide(event);
    this.props.hideModal();
  }

  render() {
    const top = this.props.top || "50%";
    const left = this.props.left || "50%";
    const position = this.props.position || "fixed";
    const transform = this.props.transform || "translate(-50%, -50%)";
    const width = this.props.width || "";
    const height = this.props.height || "";
    const transition = this.props.transition || "transition: all 200ms ease-out";
    const buttonAlign = this.props.buttonAlign || "right";

    const modalDialogStyle = {
      maxWidth: "90%",
      margin: "0px",
      top,
      position,
      left,
      transform,
      transition,
      width,
      height,
      maxHeight: "90vh",
      overflowY: "scroll",
    };

    const modalBarStyle = {};
    if (this.props.options) {
      const {options} = this.props;
      modalBarStyle.backgroundColor = _.get(
        options,
        "primary_theme_background_color.value",
        "#000000",
      );
      modalBarStyle.color = _.get(
        options,
        "primary_theme_text_color.value",
        "#000000",
      );
    }

    return (
      <div className="modal-wrapper">
        <div
          className={`modal ${
            this.props.titleColor ? this.props.titleColor : "modal-primary"
          }`}
          id="modal"
          tabIndex="-1"
          role="dialog"
        >
          <ReactCSSTransitionGroup
            component="div"
            transitionAppear
            transitionAppearTimeout={1000}
            transitionName="modal"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}
          >
            <div
              key={Object.id}
              className="modal-dialog modal-lg"
              role="document"
              style={modalDialogStyle}
            >
              <div className="modal-content">
                <div className="modal-header" style={modalBarStyle}>
                  <button onClick={this.props.hide} className="close">
                    <span>×</span>
                  </button>
                  <h4
                    className="modal-title uppercase bold"
                    id="modal-sm-primary-label"
                  >
                    <i
                      className={`modal-icon fa ${
                        this.props.icon ? this.props.icon : "fa-cog"
                      }`}
                    />
                    {this.props.modalTitle}
                  </h4>
                </div>
                <div className="modal-body">
                  {this.props.children}
                  {this.props.component}
                </div>
                <div
                  className={`modal-footer ${
                    this.props.hideFooter ? "hide" : ""
                  }`}
                >
                  {!this.props.hideCloseBtn && (
                    <button
                      onClick={this.hide}
                      className="btn btn-default btn-rounded"
                    >
                      {this.props.closeBtnText || "Close"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ReactCSSTransitionGroup>
          <div onClick={this.props.hide} className="modal-backdrop fade in" />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { options: state.options };
};
const mapDispatchtoProps = dispatch => {
  return { hideModal: () => dispatch(hideModal()) };
};
export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(Modal);
