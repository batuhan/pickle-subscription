import React from "react";
import Load from "../../utilities/load.jsx";
import { Fetcher } from "servicebot-base-form";
let _ = require("lodash");
import Inputs from "../../utilities/inputs.jsx";
import ContentTitle from "../../layouts/content-title.jsx";
import Content from "../../layouts/content.jsx";
import update from "immutability-helper";
import { connect } from "react-redux";
import Buttons from "../buttons.jsx";
import ImageUploader from "../../utilities/image-uploader.jsx";
import { setOptions } from "../../utilities/actions";

const mapStateToProps = (state, ownProps) => {
  return {
    uid: state.uid,
    user: state.user || null,
    options: state.options,
  };
};

const stripeCurrencies = [
  "USD",
  "AED",
  "AFN",
  "ALL",
  "AMD",
  "ANG",
  "AOA",
  "ARS",
  "AUD",
  "AWG",
  "AZN",
  "BAM",
  "BBD",
  "BDT",
  "BGN",
  "BIF",
  "BMD",
  "BND",
  "BOB",
  "BRL",
  "BSD",
  "BWP",
  "BZD",
  "CAD",
  "CDF",
  "CHF",
  "CLP",
  "CNY",
  "COP",
  "CRC",
  "CVE",
  "CZK",
  "DJF",
  "DKK",
  "DOP",
  "DZD",
  "EGP",
  "ETB",
  "EUR",
  "FJD",
  "FKP",
  "GBP",
  "GEL",
  "GIP",
  "GMD",
  "GNF",
  "GTQ",
  "GYD",
  "HKD",
  "HNL",
  "HRK",
  "HTG",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JMD",
  "JPY",
  "KES",
  "KGS",
  "KHR",
  "KMF",
  "KRW",
  "KYD",
  "KZT",
  "LAK",
  "LBP",
  "LKR",
  "LRD",
  "LSL",
  "MAD",
  "MDL",
  "MGA",
  "MKD",
  "MMK",
  "MNT",
  "MOP",
  "MRO",
  "MUR",
  "MVR",
  "MWK",
  "MXN",
  "MYR",
  "MZN",
  "NAD",
  "NGN",
  "NIO",
  "NOK",
  "NPR",
  "NZD",
  "PAB",
  "PEN",
  "PGK",
  "PHP",
  "PKR",
  "PLN",
  "PYG",
  "QAR",
  "RON",
  "RSD",
  "RUB",
  "RWF",
  "SAR",
  "SBD",
  "SCR",
  "SEK",
  "SGD",
  "SHP",
  "SLL",
  "SOS",
  "SRD",
  "STD",
  "SVC",
  "SZL",
  "THB",
  "TJS",
  "TOP",
  "TRY",
  "TTD",
  "TWD",
  "TZS",
  "UAH",
  "UGX",
  "UYU",
  "UZS",
  "VND",
  "VUV",
  "WST",
  "XAF",
  "XCD",
  "XOF",
  "XPF",
  "YER",
  "ZAR",
  "ZMW",
];

class SystemSettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: `/api/v1/system-options/public`,
      system_settings: false,
      loading: true,
      ajaxLoad: false,
      success: false,
      rolesUrl: `/api/v1/roles`,
      roles: [],
      currentTabType: "system",
    };
    this.fetchSettings = this.fetchSettings.bind(this);
    this.fetchRoles = this.fetchRoles.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleUpdateSettings = this.handleUpdateSettings.bind(this);
    this.handleOnBack = this.handleOnBack.bind(this);
    this.handleTab = this.handleTab.bind(this);
  }

  componentDidMount() {
    this.fetchSettings();
    this.fetchRoles();
  }

  fetchSettings() {
    let self = this;
    Fetcher(self.state.url).then(function(response) {
      if (!response.error) {
        self.setState({ loading: false, system_settings: response });
      } else {
        console.error("system setting error", response);
        self.setState({ loading: false });
      }
    });
  }

  fetchRoles() {
    let self = this;
    Fetcher(self.state.rolesUrl).then(function(response) {
      if (!response.error) {
        let userRoles = response.map(role => {
          let roleKey = role.id;
          let value = role.role_name;
          return { [value]: roleKey };
        });
        self.setState({ loading: false, roles: userRoles });
      } else {
        console.error("getting roles error", response);
        self.setState({ loading: false });
      }
    });
  }

  handleResponse(response) {
    if (!response.error) {
      this.setState({ success: true });
    }
  }

  handleOnChange(e) {
    let self = this;
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    const newData = update(self.state, {
      system_settings: {
        [name]: { value: { $set: value } },
      },
    });
    self.setState(newData);
  }

  handleUpdateSettings() {
    let self = this;
    self.setState({ ajaxLoad: true });
    let payload = _.toArray(self.state.system_settings);
    Fetcher("/api/v1/system-options", "PUT", payload).then(function(response) {
      if (!response.error) {
        self.setState({ ajaxLoad: false, success: true });
        self.props.onUpdateSettings();
      } else {
        self.setState({ ajaxLoad: false });
        console.error("Problem PUT /api/v1/system-options");
      }
    });
  }

  handleOnBack() {
    this.setState({ success: false });
    this.fetchSettings();
  }

  handleTab(type) {
    this.setState({ currentTabType: type });
  }

  getAppVersion() {
    let version = this.props.options.version;
    if (version) {
      return (
        <div className="status-badge">
          <i className="fa fa-info-circle" />
          ServiceBot Version: {version}
        </div>
      );
    } else {
      return <span />;
    }
  }

  render() {
    if (this.state.loading) {
      return <Load />;
    } else if (this.state.success && false) {
      return (
        // this is disabled
        <div>
          <div className="p-20">
            <p>
              <strong>Success! System settings has been updated.</strong>
            </p>
            <Buttons
              btnType="default"
              text="Back to System Settings"
              onClick={self.handleOnBack}
            />
          </div>
        </div>
      );
    } else {
      let self = this;
      let group = _.groupBy(this.state.system_settings, setting => {
        return setting.type ? setting.type : "other";
      });
      //let types = _.uniq(_.map(this.state.system_settings, (setting) => setting.type));
      let types = ["system"];
      console.log("TYPES", types);
      let colorSettings = _.map(this.state.system_settings, s => {
        if (
          s.data_type === "color_picker" &&
          s.value !== "undefined" &&
          s.value !== undefined
        ) {
          return s.value;
        } else {
          return null;
        }
      });
      colorSettings = _.remove(colorSettings, null);
      colorSettings = _.union(colorSettings, [
        "#FF6900",
        "#FCB900",
        "#7BDCB5",
        "#00D084",
        "#8ED1FC",
        "#0693E3",
        "#ABB8C3",
        "#EB144C",
        "#F78DA7",
        "#9900EF",
      ]);
      //for side panel settings
      if (this.props.filter) {
        return (
          <div>
            {_.indexOf(this.props.filter, "brand_logo") !== -1 && (
              <div className="sb-form-group image-upload-box">
                <label className="_label">Brand Logo</label>
                <ImageUploader
                  name="file"
                  elementID="brand-logo"
                  imageURL="/api/v1/system-options/file/brand_logo"
                  imageStyle="badge badge-lg"
                  uploadButton={true}
                  reloadNotice="Please reload the application."
                />
              </div>
            )}

            {_.indexOf(this.props.filter, "home_hero_image") !== -1 && (
              <div className="sb-form-group image-upload-box">
                <label className="_label-">Front Page Hero Image</label>
                <ImageUploader
                  name="file"
                  elementID="front-page-image"
                  imageURL="/api/v1/system-options/file/front_page_image"
                  imageStyle="badge badge-lg"
                  uploadButton={true}
                  reloadNotice="Please reload the application."
                />
              </div>
            )}

            {types.map(type => {
              return (
                <div
                  key={`setting_type_${type}`}
                  className={`system-settings-group setting-type-${type}`}
                >
                  {group[type].map(group => {
                    if (
                      this.props.filter &&
                      _.indexOf(this.props.filter, group.option) !== -1
                    ) {
                      if (group.data_type === "color_picker") {
                        return (
                          <div key={`option_${group.option}`}>
                            <Inputs
                              type={group.data_type}
                              name={group.option}
                              label={group.option.replace(/_+/g, " ")}
                              colors={colorSettings}
                              defaultValue={group.value}
                              onChange={self.handleOnChange}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div key={`option_${group.option}`}>
                            <Inputs
                              type={group.data_type}
                              name={group.option}
                              label={group.option.replace(/_+/g, " ")}
                              defaultValue={group.value}
                              onChange={self.handleOnChange}
                            />
                          </div>
                        );
                      }
                    }
                  })}
                  <div className="clearfix" />
                </div>
              );
            })}
            <div className="text-right">
              <Buttons
                btnType="primary"
                text="Update Settings"
                onClick={self.handleUpdateSettings}
                loading={this.state.ajaxLoad}
                success={this.state.success}
              />
            </div>
          </div>
        );
      } else {
        // for system settings page

        // let tabStyle = (type) => {
        //     let tabColor = this.state.system_settings.button_primary_color.value;
        //     if(type == self.state.currentTabType){
        //         return({borderColor: tabColor});
        //     }else{
        //         return({});
        //     }
        // };
        //

        return (
          <React.Fragment>
            <div className={`_section`}>
              <p>{this.getAppVersion()}</p>

              <div className={`tiers`}>
                <div className={`_tier-detail`}>
                  <h3>{this.state.currentTabType}</h3>

                  <div className="system-settings-page-form">
                    {this.state.currentTabType === "branding" ? (
                      <div className={`__type-branding`}>
                        <h4 className="text-capitalize">Branding</h4>
                        <div className="__item">
                          <label className="control-label">Brand Logo</label>
                          <ImageUploader
                            name="file"
                            elementID="brand-logo"
                            imageURL="/api/v1/system-options/file/brand_logo"
                            imageStyle="badge badge-lg"
                            uploadButton={true}
                          />
                        </div>
                        <div className="__item">
                          <label className="control-label">
                            Homepage Image
                          </label>
                          <ImageUploader
                            name="file"
                            elementID="front-page-image"
                            imageURL="/api/v1/system-options/file/front_page_image"
                            imageStyle="badge badge-lg"
                            uploadButton={true}
                          />
                        </div>
                        <div className="__item">
                          <label className="control-label">Loader Logo</label>
                          <ImageUploader
                            name="file"
                            elementID="loader-logo"
                            imageURL="/api/v1/system-options/file/loader_logo"
                            imageStyle="badge badge-lg"
                            uploadButton={true}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        key={`setting_type_${this.state.currentTabType}`}
                        className={`system-settings-group setting-type-${this.state.currentTabType}`}
                      >
                        {group[this.state.currentTabType] &&
                          group[this.state.currentTabType].map(group => {
                            if (group.data_type === "color_picker") {
                              return (
                                <div key={`option_${group.option}`}>
                                  <Inputs
                                    type={group.data_type}
                                    name={group.option}
                                    label={group.option.replace(/_+/g, " ")}
                                    colors={colorSettings}
                                    defaultValue={group.value}
                                    onChange={self.handleOnChange}
                                  />
                                </div>
                              );
                            } else if (group.data_type === "user_role") {
                              return (
                                //this is special case
                                <div key={`option_${group.option}`}>
                                  <Inputs
                                    type="select"
                                    name={group.option}
                                    label={group.option.replace(/_+/g, " ")}
                                    value={group.value}
                                    options={self.state.roles}
                                    onChange={self.handleOnChange}
                                  />
                                </div>
                              );
                            } else if (group.data_type === "currency") {
                              return (
                                //this is special case for currency
                                <div key={`option_${group.option}`}>
                                  <Inputs
                                    type="select"
                                    name={group.option}
                                    label={group.option.replace(/_+/g, " ")}
                                    value={group.value}
                                    options={stripeCurrencies}
                                    onChange={self.handleOnChange}
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div key={`option_${group.option}`}>
                                  <Inputs
                                    type={group.data_type}
                                    name={group.option}
                                    label={group.option.replace(/_+/g, " ")}
                                    defaultValue={group.value}
                                    onChange={self.handleOnChange}
                                  />
                                </div>
                              );
                            }
                          })}
                        <div className="clearfix" />
                      </div>
                    )}

                    <div className="text-right">
                      <Buttons
                        btnType="primary"
                        buttonClass="_primary"
                        text="Update Settings"
                        onClick={self.handleUpdateSettings}
                        loading={this.state.ajaxLoad}
                        success={this.state.success}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      }
    }
  }
}

let mapDispatch = function(dispatch) {
  return {
    onUpdateSettings: () => {
      Fetcher("/api/v1/system-options/public").then(options => {
        dispatch(setOptions(options));
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatch,
)(SystemSettingsForm);
