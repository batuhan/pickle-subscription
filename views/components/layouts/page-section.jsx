import React from "react";

class PageSection extends React.Component {
  render() {
    const { onMouseEnter, onMouseLeave, className, style, type } = this.props;
    return (
      <div
        className={`section ${className}`}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={type || "container"}>{this.props.children}</div>
      </div>
    );
  }
}

export default PageSection;
