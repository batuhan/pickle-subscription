const EventLogs = require("../../../models/event-log");
const StripeLogs = require("../../../models/base/entity")("stripe_event_logs");

StripeLogs.log = function(
  event_id,
  logMessage,
  userId = null,
  logType = "STRIPE",
  logLevel = "INFO",
) {
  const eventObj = EventLogs.getLogObj(userId, logMessage, logType, logLevel);
  eventObj.event_id = event_id;

  const newEvent = new StripeLogs(eventObj);

  newEvent.create(function(result) {
    console.log("Stripe log created.");
  });
};

module.exports = StripeLogs;
