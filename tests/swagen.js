const knex = require("../config/db");

const ServiceTemplate = require("../models/service-template");
const ServiceTemplateProperties = require("../models/service-template-property");
const ServiceCategorites = require("../models/service-category");
const ServiceInstance = require("../models/service-instance");
const ServiceInstanceProperties = require("../models/service-instance-property");
const ServiceInstanceMessages = require("../models/service-instance-message");
const ChargeItems = require("../models/charge");
const ServiceInstanceCancellation = require("../models/service-instance-cancellation");
const Users = require("../models/user");
const Roles = require("../models/role");
const EventLogs = require("../models/event-log");
const NotificationTemplates = require("../models/notification-template");
const Invoice = require("../models/invoice");
const InvoiceLine = require("../models/invoice-line");
const Transactions = require("../models/transaction");
const SystemOptions = require("../models/system-options");
const Files = require("../models/file");

console.log(knex.fn.now());

function genProp(data) {
  const returnProp = {};
  if (data.type == "character varying") {
    returnProp.type = "string";
  } else {
    returnProp.type = data.type;
  }
  if (data.maxLength) {
    returnProp.maxLength = data.maxLength;
  }
  returnProp.required = !data.nullable;
  returnProp.description = "FILL ME OUT!!!!";
  return returnProp;
}
function generate(model) {
  model.getSchema(true, true, function(schema) {
    const json = { type: "object", properties: {} };
    for (const prop in schema) {
      if (prop == "references") {
        const newProp = { type: "object", properties: {} };
        for (const refProp in schema[prop]) {
          newProp.properties[refProp] = {
            type: "array",
            items: [{ $ref: `#/definitions/${refProp}` }],
          };
        }
        json.properties[prop] = newProp;
      } else {
        json.properties[prop] = genProp(schema[prop]);
      }
    }
    console.log(JSON.stringify(json));
  });
}

generate(Files);
