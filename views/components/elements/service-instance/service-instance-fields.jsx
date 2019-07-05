import React from "react";
import { isAuthorized } from "../../utilities/authorizer.jsx";
import ServiceInstanceField from "./service-instance-field.jsx";
class ServiceInstanceFields extends React.Component {
  render() {
    return (
      <div className="service-instance-box p-0">
        <div className="service-instance-box-title">
          <span>Request Details</span>
        </div>
        <div className="service-instance-box-content p-b-30">
          <span className="m-b-20 block label color-grey-600">
            These fields were selected during the request process of this item.
            They are shown exactly as entered initially.
          </span>
          <div className="row">
            {this.props.instanceProperties.map(field => {
              if (field.data) {
                return (
                  <div className="sb-form-groupform-group-flex">
                    <ServiceInstanceField
                      key={"item-" + field.id}
                      currency={
                        (this.props.instance.payment_plan &&
                          this.props.instance.payment_plan.currency) ||
                        "USD"
                      }
                      field={field}
                    />
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ServiceInstanceFields;
