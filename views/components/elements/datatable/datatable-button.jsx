import React from "react";
import { Link, hashHistory } from "react-router";
import _ from "lodash";

class Buttons extends React.Component {
  constructor(props) {
    super(props);

    this.processButton = this.processButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  processButton(link, id) {
    const myLink = _.isFunction(link) ? link(this.props.active) : link;

    if (myLink) {
      const linkArray = myLink.split("/");
      if (linkArray.indexOf(":id") > -1) {
        linkArray[linkArray.indexOf(":id")] = id;
        const resultLink = linkArray.join("/");

        return resultLink;
      }
    }
    return myLink;
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(this.props.dataObject);
    }
  }

  render() {
    return (
      <div
        id="action-buttons"
        className="btn-group"
        role="group"
        aria-label="Some Label"
      >
        <Link
          to={this.processButton(this.props.link, this.props.id)}
          onClick={this.handleClick}
          type="button"
          className="btn btn-default btn-rounded"
        >
          {_.isFunction(this.props.name)
            ? this.props.name(this.props.active)
            : this.props.name}
        </Link>
      </div>
    );
  }
}

export default Buttons;
