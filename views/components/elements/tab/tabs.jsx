import React from "react";
import { Link, hashHistory, browserHistory } from "react-router";
import Load from "../../utilities/load.jsx";
import Fetcher from "../../utilities/fetcher.jsx";
import Tab from "./tab.jsx";
import TabContent from "./tab-content.jsx";

class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      url: this.props.tabUrl,
      contentUrl: this.props.contentUrl,
      loading: true,
      activeTabId: null,
      contentTitle: null,
    };

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    const self = this;
    Fetcher(self.state.url).then(function(response) {
      if (!response.error) {
        self.setState({ tabs: response });

        if (self.state.tabs.length > 0) {
          self.setState({
            activeTabId: self.state.tabs[0].id,
            contentTitle: self.state.tabs[0].name,
          });
        } else {
          self.setState({ activeTabId: -1, contentTitle: "Other" });
        }
      }
      self.setState({ loading: false });
    });
  }

  handleTabClick(tabId, tabName) {
    this.setState({ activeTabId: tabId, contentTitle: tabName });
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    } 
      // Gather data first
      const {tabs} = this.state;
      const {activeTabId} = this.state;

      if (tabs.length > 0) {
        return (
          <div className="tab-container">
            <div className="tabs">
              {this.state.tabs.map(tab => (
                <Tab
                  key={`tab-${tab.id}`}
                  active={activeTabId == tab.id}
                  handleClick={() => this.handleTabClick(tab.id, tab.name)}
                  id={tab.id}
                  name={tab.name}
                />
              ))}
            </div>
            <div className="tab-content">
              {this.state.tabs.length > 0 ? (
                <TabContent
                  contentTitle={this.state.contentTitle}
                  contentUrl={
                    `${this.state.contentUrl  }${  this.state.activeTabId}`
                  }
                  imgUrl={this.props.imgUrl}
                />
              ) : (
                <p>You don't have any services</p>
              )}
            </div>
          </div>
        );
      } 
        return (
          <div className="tab-container">
            <div className="tabs">
              <Tab
                key={`tab-${-1}`}
                active
                handleClick={() => null}
                id={-1}
                name="Other"
              />
            </div>
            <div className="tab-content">
              <p>
                You don't have any services yet. Go ahead and
                <Link clssName="color-info" to="/manage-catalog/create">
                  {" "}
                  create
                  {" "}
                </Link>
                one now.
              </p>
            </div>
          </div>
        );
      
    
  }
}

export default Tabs;
