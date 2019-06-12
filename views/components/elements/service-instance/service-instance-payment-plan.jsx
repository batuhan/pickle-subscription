import React from "react";
import { Link, browserHistory } from "react-router";
import ReactTooltip from "react-tooltip";
import { Price, getPrice, getBillingType } from "../../utilities/price.jsx";
import Buttons from "../buttons.jsx";
import Avatar from "../avatar.jsx";
import { Authorizer } from "../../utilities/authorizer.jsx";
import InfoToolTip from "../tooltips/info-tooltip.jsx";
import DashboardWidget from "../my-services/dashboard-widget.jsx";
import ApplicationLauncher from "../my-services/application-launcher.jsx";
import DateFormat from "../../utilities/date-format.jsx";
import TrialActionButton from "../my-services/trial-action-button.jsx";

class ServiceInstancePaymentPlan extends React.Component {
  getServiceStatus() {
    const self = this;
    const { owner } = this.props;
    if (owner.status !== "suspended") {
      const charges = self.props.service.references.charge_items;
      const unpaidCharges = _.filter(charges, item => {
        return !item.approved;
      });
      let totalCharges = 0;
      unpaidCharges.map(charge => {
        totalCharges += charge.amount;
      });

      // Get service trial status
      let inTrial = false;
      const trial = self.props.service.payment_plan.trial_period_days;
      if (self.props.service.status === "running" && trial > 0) {
        const currentDate = new Date(self.props.service.subscribed_at * 1000);
        const trialEnd = new Date(self.props.service.trial_end * 1000);
        // Service is trialing if the expiration is after current date
        if (currentDate < trialEnd) {
          inTrial = true;
        }
      }

      if (
        self.props.status === "requested" &&
        totalCharges === 0 &&
        self.props.service.payment_plan.amount === 0
      ) {
        return (
          <DashboardWidget
            small
            widgetColor="#7f04bb"
            widgetIcon="undo"
            widgetData="Pending Quote"
            widgetClass="col-12"
            widgetHoverClass="pending-quote"
          />
        );
      }
      if (self.props.status === "requested") {
        return (
          <DashboardWidget
            small
            widgetColor="#0d9e6a"
            clickAction={this.props.approval}
            widgetIcon="usd"
            widgetData="Pay Now"
            widgetClass="col-12"
            widgetHoverClass="widget-hover"
          />
        );
      }
      if (self.props.status === "waiting_cancellation") {
        return (
          <DashboardWidget
            small
            widgetColor="#ffa000"
            clickAction={this.props.cancelUndo}
            widgetIcon="hourglass-end"
            widgetData="Cancel Pending"
            widgetClass="col-12"
            widgetHoverClass="cancel-pending"
          />
        );
      }
      if (self.props.status === "cancelled") {
        return (
          <DashboardWidget
            small
            widgetColor="#000000"
            clickAction={this.props.approval}
            widgetIcon="times"
            widgetData="Cancelled"
            widgetClass="col-12"
            widgetHoverClass="restart"
          />
        );
      }
      if (
        this.props.allCharges.false &&
        this.props.allCharges.false.length > 0
      ) {
        return (
          <DashboardWidget
            small
            widgetColor="#0d9e6a"
            clickAction={this.props.handleAllCharges}
            widgetIcon="usd"
            widgetData="Pay Now"
            widgetClass="col-12"
            widgetHoverClass="widget-hover"
          />
        );
      }
      if (
        (self.props.status === "running" ||
          self.props.status === "in_progress") &&
        inTrial
      ) {
        return (
          <DashboardWidget
            small
            widgetColor="#0069ff"
            clickAction={this.props.cancel}
            widgetIcon="clock-o"
            widgetData="Trialing"
            widgetClass="col-12"
            widgetHoverClass="cancel"
          />
        );
      }
      if (
        self.props.status === "running" ||
        self.props.status === "in_progress"
      ) {
        return (
          <DashboardWidget
            small
            widgetColor="#0069ff"
            clickAction={this.props.cancel}
            widgetIcon="check"
            widgetData="Active Item"
            widgetClass="col-12"
            widgetHoverClass="cancel"
          />
        );
      }
      return null;
    }
    return (
      <DashboardWidget
        widgetColor="#da0304"
        widgetIcon="ban"
        widgetData="Suspended"
        widgetClass="col-xs-12 col-sm-6 col-md-4 col-xl-4 p-r-5"
      />
    );
  }

  getSplitPayments() {
    const self = this;
    const serviceInstance = self.props.service;
    const splitPayments = serviceInstance.split_configuration;
    if (serviceInstance.type === "split" && splitPayments) {
      return (
        <div className="service-instance-box black">
          <div className="service-instance-box-title black">
            <span>Scheduled Payment Details</span>
          </div>
          <div className="service-instance-box-content">
            {splitPayments.splits.map(splitItem => (
              <div className="split-wrapper">
                <div className="subscription-pricing row m-r-0 m-l-0 p-0">
                  <div className="col-md-6 p-r-0 p-l-0">
                    {splitItem.charge_day === 0 ? (
                      <span>Paid Instantly</span>
                    ) : (
                      <span>
                        After
                        {splitItem.charge_day} Days
                      </span>
                    )}
                  </div>
                  <div className="col-md-6 p-r-0 p-l-0 text-right">
                    <b>
                      <Price value={splitItem.amount} />
                    </b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  // TODO: change this to property widget type
  // Get application launch action based on URL custom variable.
  getLinkActionButton() {
    const self = this;
    const instance = self.props.service;
    const websiteLink = instance.references.service_instance_properties.filter(
      link => link.name === "url",
    )[0];
    if (status !== "cancelled" && websiteLink) {
      return (
        <ApplicationLauncher
          serviceInstance={instance}
          instanceLink={websiteLink}
          large
        />
      );
    }
  }

  getServiceType() {
    if (this.props.service.type === "subscription") {
      return (
        <DashboardWidget
          plain
          widgetIcon="circle"
          widgetData={getPrice(
            this.props.service.payment_plan,
            this.props.service.type,
          )}
          widgetClass="col-12 instance-price"
        />
      );
    }
    return null;
  }

  getTrialButton() {
    return (
      <TrialActionButton
        large
        userFunds={this.props.userFunds}
        serviceInstance={this.props.service}
        modalCallback={this.props.fundModal}
      />
    );
  }

  getServiceDetail() {
    return (
      <div>
        {this.getServiceStatus()}
        {this.getTrialButton()}
        {this.getServiceType()}
      </div>
    );
  }

  getCustomerInfo() {
    const { owner } = this.props;
    if (owner.status !== "suspended") {
      return (
        <Authorizer permissions={["can_administrate"]}>
          <div className="service-instance-box black">
            <div className="service-instance-box-title black">
              <span>Customer Information</span>
            </div>
            <div id="instance-owner" className="service-instance-box-content">
              <div>
                {owner.status && (
                  <div>
                    <span>
                      <i className="fa fa-check" />
                      Status: {owner.status}
                    </span>
                    <br />
                  </div>
                )}
                {owner.email && (
                  <div>
                    <span>
                      <i className="fa fa-envelope" />
                      Email: {owner.email}
                    </span>
                    <br />
                  </div>
                )}
                {owner.name && (
                  <div>
                    <span>
                      <i className="fa fa-user" />
                      Name: {owner.name}
                    </span>
                    <br />
                  </div>
                )}
                {owner.phone && (
                  <span>
                    <i className="fa fa-phone" />
                    Phone #: {owner.phone}
                  </span>
                )}
              </div>
              <div>
                <Avatar
                  key={`owner-avatar-${owner.id}`}
                  linked
                  size="lg"
                  uid={owner.id}
                />
              </div>
            </div>
          </div>
        </Authorizer>
      );
    }
    return (
      <Authorizer permissions={["can_administrate"]}>
        <div className="service-instance-box red">
          <div className="service-instance-box-title red">
            <span>Customer is Suspended</span>
          </div>
          <div id="instance-owner" className="service-instance-box-content">
            <div>
              {owner.status && (
                <div>
                  <span>
                    <i className="fa fa-ban" />
                    Status: {owner.status}
                  </span>
                  <br />
                </div>
              )}
              {owner.email && (
                <div>
                  <span>
                    <i className="fa fa-envelope" />
                    Email: {owner.email}
                  </span>
                  <br />
                </div>
              )}
              {owner.name && (
                <div>
                  <span>
                    <i className="fa fa-user" />
                    Name: {owner.name}
                  </span>
                  <br />
                </div>
              )}
              {owner.phone && (
                <span>
                  <i className="fa fa-phone" />
                  Phone #: {owner.phone}
                </span>
              )}
            </div>
            <div>
              <Avatar
                key={`owner-avatar-${owner.id}`}
                linked
                size="lg"
                uid={owner.id}
              />
            </div>
          </div>
        </div>
      </Authorizer>
    );
  }

  render() {
    const paymentPlan = this.props.instancePaymentPlan;

    if (paymentPlan !== null) {
      return (
        <div className="">
          <div className="row m-b-10">
            <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8 col-xl-8 p-r-5">
              <h1>{this.props.service.name}</h1>
              <p>
                {this.props.service.description} <br /> Purchased{" "}
                <strong>
                  <DateFormat date={this.props.service.created_at} time />
                </strong>
              </p>
              {this.getLinkActionButton()}
            </div>
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 p-l-5">
              {this.getServiceDetail()}
            </div>
          </div>
          {this.getSplitPayments()}
          {this.getCustomerInfo()}
        </div>
      );
    }
    return (
      <div>
        <div className="row m-b-10">
          <div className="col-xs-12 col-sm-6 col-md-8 col-lg-8 col-xl-8 p-r-5">
            <h1>{this.props.service.name}</h1>
            <p>
              {this.props.service.description} <br /> Purchased{" "}
              <strong>
                <DateFormat date={this.props.service.created_at} time />
              </strong>
            </p>
            {this.getLinkActionButton()}
          </div>
        </div>
        <div className="alert-box red">
          <strong>
            This service currently has no payment information attached to it.
            Contact the administrator.
          </strong>
        </div>
        {this.getCustomerInfo()}
      </div>
    );
  }
}

export default ServiceInstancePaymentPlan;
