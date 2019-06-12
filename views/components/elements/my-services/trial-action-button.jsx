import React from "react";
import ToolTip from "../tooltips/tooltip.jsx";
import DashboardWidget from "./dashboard-widget.jsx";

class TrialFundAddition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instance: this.props.serviceInstance,
    };
  }

  render() {
    const self = this;
    let inTrial = false;
    let hasFund = false;
    let trialExpires = "";

    const date_diff_indays = (date1, date2) => {
      const dt1 = new Date(date1);
      const dt2 = new Date(date2);
      return Math.floor(
        (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
          Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
          (1000 * 60 * 60 * 24),
      );
    };

    // Get service trial status
    const trial = self.state.instance.payment_plan.trial_period_days;
    if (self.props.userFunds.length > 0) {
      hasFund = true;
    }
    if (self.state.instance.status === "running" && trial > 0) {
      const currentDate = new Date();
      const trialEnd = new Date(self.state.instance.trial_end * 1000);
      // Service is trialing if the expiration is after current date
      if (currentDate < trialEnd) {
        inTrial = true;
        trialExpires = `Trial expires in ${date_diff_indays(
          currentDate,
          trialEnd,
        )} days`;
      }
    }

    if (inTrial) {
      if (!hasFund) {
        if (self.props.large) {
          return (
            <div>
              <DashboardWidget
                small
                clickAction={self.props.modalCallback}
                margins="m-t-0"
                widgetColor="#04bb8a"
                widgetIcon="credit-card"
                widgetData="Add Fund"
                widgetClass="col-12"
                widgetHoverClass="widget-hover"
              />
              <div className="text-center">
                <strong>{trialExpires}</strong>
              </div>
            </div>
          );
        } 
          return (
            <ToolTip
              text="Add Fund"
              title={trialExpires}
              icon="fa-credit-card-alt"
              cssClass="btn-default btn-rounded btn-sm"
              onClick={self.props.modalCallback}
            />
          );
        
      } 
        if (self.props.large) {
          return (
            <div className="text-center">
              <strong>{trialExpires}</strong>
            </div>
          );
        } 
          return null;
        
      
    } 
      return null;
    
  }
}

export default TrialFundAddition;
