import React from "react";
import $ from "jquery";
import "../../../../public/js/bootstrap-3.3.7-dist/js/bootstrap.js";

class ToolTip extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(this.refs.tooltip).tooltip();
  }

  render() {
    const self = this;
    const text = self.props.text || "-";
    const style = self.props.style || {};
    const placement = self.props.placement || "left";
    const title = self.props.title || "tooltip";
    const cssClass = self.props.cssClass || "btn-default";
    const clickAction = self.props.onClick || null;

    const getText = () => {
      if (self.props.icon) {
        return (
          <div>
            <i className={`fa ${self.props.icon}`} /> 
            {' '}
            {text}
          </div>
        );
      } 
        return null;
      
    };

    // let delay = this.props.delay || 0;
    return (
      <button
        type="button"
        ref="tooltip"
        style={style}
        className={`btn ${cssClass}`}
        data-placement={placement}
        title={title}
        onClick={clickAction}
      >
        {getText()}
      </button>
    );
  }
}

export default ToolTip;
