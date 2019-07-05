import React from "react";
import "./css/style.css";
import { browserHistory } from "react-router";
import { Price } from "../../utilities/price.jsx";
import { connect } from "react-redux";
let _ = require("lodash");
import {
  hexToRgb,
  rgbToHex,
  getDarkenedRGB,
  getThemeHeaderRGB,
  getThemeContentRGB,
} from "../../utilities/color-converter.js";
import ContentTitle from "../../layouts/content-title.jsx";

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };

    this.goTo = this.goTo.bind(this);
  }

  goTo() {
    browserHistory.push(this.props.to);
  }

  getCSSClass() {
    if (this.props.to) {
      return "linked";
    }
  }

  getFormatted(value) {
    if (this.props.type) {
      if (this.props.type === "price") {
        let { options } = this.props;
        return (
          <Price
            value={value}
            currency={(options.currency && options.currency.value) || "USD"}
          />
        );
      }
    } else {
      return value;
    }
  }

  render() {
    let style = { widgetData: {}, widgetLabel: {} };
    let { options } = this.props;
    if (this.props.options) {
      let options = this.props.options;
      style.widgetData.backgroundColor = _.get(
        options,
        "primary_theme_background_color.value",
        "#000000",
      );

      let darkened = getDarkenedRGB(
        hexToRgb(
          _.get(options, "primary_theme_background_color.value", "#000000"),
        ),
      );
      let darkenedHex = rgbToHex(darkened.r, darkened.g, darkened.b);
      let greenHeader = rgbToHex(44, 212, 130);
      let greenContent = rgbToHex(2, 191, 99);
      style.widgetLabel.backgroundColor = darkenedHex;
      style.widgetLabel.color = _.get(
        options,
        "primary_theme_text_color.value",
        "#ffffff",
      );
      if (this.props.wcolor === "green") {
        style.widgetData.backgroundColor = rgbToHex(2, 191, 99);
        style.widgetLabel.backgroundColor = rgbToHex(44, 212, 130);
      } else if (this.props.wcolor === "orange") {
        style.widgetData.backgroundColor = rgbToHex(232, 90, 89);
        style.widgetLabel.backgroundColor = rgbToHex(255, 129, 106);
        style.widgetLabel.color = rgbToHex(8, 28, 73);
      } else if (this.props.wcolor === "purple") {
        let newColor = getThemeHeaderRGB(
          hexToRgb(
            _.get(options, "primary_theme_background_color.value", "#000000"),
          ),
        );
        let newColorContent = getThemeContentRGB(
          hexToRgb(
            _.get(options, "primary_theme_background_color.value", "#000000"),
          ),
        );
        style.widgetData.backgroundColor = rgbToHex(
          newColorContent.r,
          newColorContent.g,
          newColorContent.b,
        );
        style.widgetLabel.backgroundColor = rgbToHex(
          newColor.r,
          newColor.g,
          newColor.b,
        );
      } else if (this.props.wcolor === "clear") {
        style.widgetData.backgroundColor = "none";
        style.widgetLabel.backgroundColor = "none";
        style.widgetLabel.color = rgbToHex(0, 0, 0);
      } else if (this.props.wcolor === "grey") {
        let newColor = getThemeContentRGB(
          hexToRgb(
            _.get(options, "primary_theme_background_color.value", "#000000"),
          ),
        );
        style.widgetData.backgroundColor = rgbToHex(255, 255, 255);
        style.widgetLabel.backgroundColor = rgbToHex(
          newColor.r,
          newColor.g,
          newColor.b,
        );
        style.widgetData.color = rgbToHex(0, 0, 0);
      } else if (this.props.wcolor === "theme-clear") {
        //The label is based on the theme
        style.widgetData.backgroundColor = rgbToHex(255, 255, 255);
        style.widgetData.color = rgbToHex(0, 0, 0);
      } else if (this.props.wcolor === "blue") {
        //The label is based on the theme
        style.widgetLabel.backgroundColor = rgbToHex(31, 85, 207);
        style.widgetData.backgroundColor = rgbToHex(76, 130, 252);
      } else if (this.props.wcolor === "dblue") {
        //The label is based on the theme
        style.widgetLabel.backgroundColor = rgbToHex(76, 130, 252);
        style.widgetData.backgroundColor = rgbToHex(33, 84, 207);
      } else if (this.props.wcolor === "navy") {
        //The label is based on the theme
        style.widgetLabel.backgroundColor = rgbToHex(8, 28, 73);
        style.widgetData.backgroundColor = rgbToHex(71, 89, 121);
      } else if (this.props.wcolor === "navy-rev") {
        //The label is based on the theme
        style.widgetLabel.backgroundColor = rgbToHex(71, 89, 121);
        style.widgetData.backgroundColor = rgbToHex(8, 28, 73);
      } else if (this.props.wcolor === "navy-grey") {
        style.widgetLabel.backgroundColor = rgbToHex(8, 28, 73);
        style.widgetData.backgroundColor = rgbToHex(255, 255, 255);
        style.widgetData.color = rgbToHex(0, 0, 0);
      } else if (this.props.wcolor === "yellow") {
        //The label is based on the theme
        style.widgetLabel.backgroundColor = rgbToHex(251, 233, 156);
        style.widgetData.backgroundColor = rgbToHex(251, 233, 156);
        style.widgetData.color = rgbToHex(0, 0, 0);
      } else if (this.props.wcolor === "salmon") {
        style.widgetLabel.backgroundColor = rgbToHex(230, 87, 88);
        style.widgetData.backgroundColor = rgbToHex(230, 87, 88);
        style.widgetData.color = rgbToHex(255, 255, 255);
      }
    }

    let bodyClass = this.props.bodyClass;

    return (
      <div
        className={`dashboard-widget ${bodyClass} ${this.getCSSClass()}`}
        onClick={this.goTo}
        style={style.widgetData}
      >
        {!this.props.minimize && (
          <div className="widget-label" style={style.widgetLabel}>
            {this.state.data.label}
          </div>
        )}
        {this.state.data.value !== undefined && this.state.data.value !== null && (
          <div className="widget-data">
            {this.getFormatted(this.state.data.value)}
            <span className="sub">{this.props.postFix}</span>
            {this.props.minimize && (
              <div className="widget-label-mini">{this.state.data.label}</div>
            )}
          </div>
        )}
        {this.state.data.list && this.state.data.list.length > 0 && (
          <React.Fragment>
            {this.state.data.list.map((listing, index) => (
              <div key={"price-" + index} className="dash-widget-list">
                <div className="__label">{listing.label}</div>
                <div className="__value">
                  {listing.type && listing.type === "price" ? (
                    <Price
                      value={listing.value}
                      currency={
                        (options.currency && options.currency.value) || "USD"
                      }
                    />
                  ) : (
                    listing.value
                  )}
                </div>
              </div>
            ))}
          </React.Fragment>
        )}
        {this.state.data.chart && (
          <this.state.data.chart
            chartData={this.props.data.chartData}
            chartOption={this.props.data.chartOption}
          />
        )}
        {this.state.data.component && <this.state.data.component />}
      </div>
    );
  }
}

Widget = connect(state => {
  return { options: state.options };
})(Widget);

class DashboardWidgets extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data };
  }

  render() {
    return (
      <React.Fragment>
        <div className="dashboard-widgets __top-widgets">
          <Widget
            data={{
              label: "ARR",
              value: this.state.data.salesStats.subscriptionStats.arr,
            }}
            postFix="/yr"
            type="price"
            wcolor="blue"
          />
          <Widget
            data={{
              label: "MRR",
              value: this.state.data.salesStats.subscriptionStats.mrr,
            }}
            postFix="/mo"
            type="price"
            wcolor="blue"
          />
          <Widget
            data={{
              label: "One-time Charges",
              value: this.state.data.salesStats.oneTimeStats.approvedCharges,
            }}
            type="price"
            wcolor="dblue"
          />
          <Widget
            data={{
              label: "Total Received",
              value: this.state.data.totalSales,
            }}
            type="price"
            wcolor="navy-rev"
          />
        </div>
        <ContentTitle title="Subscription Metrics" />
        <div className="dashboard-widgets __metrics-widgets">
          <div className="section-wrapper">
            <Widget
              data={{
                label: "Total Subscribers",
                value: this.state.data.salesStats.subscriptionStats.all,
              }}
              wcolor="dblue"
              minimize={true}
            />
            <Widget
              data={{
                label: "In Trial",
                value: this.state.data.salesStats.subscriptionStats.trials,
              }}
              wcolor="grey"
              minimize={true}
            />
            <Widget
              data={{
                label: "Active Subscribers",
                value: this.state.data.salesStats.subscriptionStats.active,
              }}
              wcolor="grey"
              minimize={true}
            />
            <Widget
              data={{
                label: "Cancelled Subscribers",
                value: this.state.data.salesStats.subscriptionStats.cancelled,
              }}
              wcolor="grey"
              minimize={true}
            />
          </div>
          <div className="section-wrapper">
            <Widget
              data={{
                label: "Paying Subscribers",
                value: this.state.data.salesStats.subscriptionStats.paying,
              }}
              wcolor="dblue"
              minimize={true}
            />
            <Widget
              data={{
                label: "Paying During Trial",
                value: this.state.data.salesStats.subscriptionStats.trialPaying,
              }}
              wcolor="grey"
              minimize={true}
            />
            <Widget
              data={{
                label: "Flagged Subscribers",
                value: this.state.data.salesStats.subscriptionStats.flagged,
              }}
              wcolor="grey"
              minimize={true}
            />
            <Widget
              data={{
                label: "Cancelled while paying",
                value: this.state.data.salesStats.subscriptionStats
                  .payingCancelled,
              }}
              wcolor="grey"
              minimize={true}
            />
          </div>
          <div className="section-wrapper">
            <Widget
              data={{
                label: "Average Conversion",
                value: this.state.data.salesStats.subscriptionStats
                  .averageConversion,
              }}
              postFix="%"
              wcolor="blue"
              minimize={true}
            />
            <Widget
              data={{
                label: "ARPA",
                value: this.state.data.salesStats.subscriptionStats.arpa,
              }}
              type="price"
              wcolor="grey"
              minimize={true}
            />
            <Widget
              data={{
                label: "Churn Rate",
                value: this.state.data.salesStats.subscriptionStats.churn,
              }}
              postFix="%"
              wcolor="salmon"
              minimize={true}
            />
            <Widget
              data={{
                label: "ARR Forecast",
                value: this.state.data.salesStats.subscriptionStats.arrForecast,
              }}
              postFix="/yr"
              type="price"
              wcolor="navy-rev"
              minimize={true}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export { DashboardWidgets, Widget };
