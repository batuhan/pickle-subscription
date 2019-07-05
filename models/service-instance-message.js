const User = require('./user');

const references = [
    {"model":User, "referenceField": "user_id", "direction":"to", "readOnly": true}
];

const InstanceMessage = require("./base/entity")("service_instance_messages", references);


module.exports = InstanceMessage;