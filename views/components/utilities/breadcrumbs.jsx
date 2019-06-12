import React from "react";
import { Link } from "react-router";

const CleanBreadcrumb = function(breadcrumb) {
  const cleaned = _.replace(breadcrumb, /[-_]/g, " ");
  const capitalized = _.capitalize(cleaned);
  return capitalized;
};

const CleanBreadcrumbLink = function(link) {
  let newLink = link;
  if (newLink.charAt(newLink.length - 1) == "/") {
    newLink = newLink.substr(0, newLink.length - 1);
  }
  return newLink;
};

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: this.props.color,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.color) {
      this.setState({ color: nextProps.color });
    }
  }

  render() {
    const path = this.props.location.pathname;

    const pathArray = path.split("/");

    if (pathArray.length) {
      if (pathArray.length == 2 && pathArray[1] == "") {
        return (
          <li style={this.state.color}>
            <Link to="/" style={this.state.color}>
              Home
            </Link>
          </li>
        );
      } if (pathArray.length >= 2) {
        let breadcrumbLink = "";
        let count = 0;
        return (
          <ol className="breadcrumb icon-home icon-angle-right no-bg">
            {pathArray.map(breadcrumb => (
              <li
                data={(breadcrumbLink = `${breadcrumbLink + breadcrumb  }/`)}
                key={`breadcrumb-${breadcrumb}-${count++}`}
                style={this.state.color}
              >
                {breadcrumb == "" ? (
                  count == 1 && (
                    <Link to="/" style={this.state.color}>
                      Home
                    </Link>
                  )
                ) : count + 1 == pathArray.length ? (
                  <Link
                    style={this.state.color}
                    to={CleanBreadcrumbLink(breadcrumbLink)}
                  >
                    {CleanBreadcrumb(breadcrumb)}
                  </Link>
                ) : (
                  <span style={this.state.color}>
                    {CleanBreadcrumb(breadcrumb)}
                  </span>
                )}
              </li>
            ))}
          </ol>
        );
      } 
        return (
          <li style={this.state.color}>
            <Link to="/" style={this.state.color}>
              Home
            </Link>
          </li>
        );
      
    }
  }
}

export default Breadcrumb;
