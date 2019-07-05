const PaymentStructureTemplate = require("./payment-structure-template");

const references = [
    {"model" :PaymentStructureTemplate, "referenceField": "tier_id", "direction" : "from", "readOnly" : false}
];

const Tier = require("./base/entity")("tiers", references);


module.exports = Tier;