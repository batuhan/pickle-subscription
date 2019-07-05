// let ServiceInstances = require("./service-instance");
const InstanceProperty = require("./base/entity")(
  "service_instance_properties",
);
const knex = require("../config/db.js");

InstanceProperty.getByTemplateId = function(templateId, callback) {
  require("./service-instance").findAll("service_id", templateId, function(
    instances,
  ) {
    const instanceIds = instances.map(entity => entity.data.id);
    knex(InstanceProperty.table)
      .whereIn("parent_id", instanceIds)
      .then(function(result) {
        if (!result) {
          result = [];
        }
        const entities = result.map(e => new InstanceProperty(e));
        callback(entities);
      })
      .catch(function(err) {
        console.error(err);
      });
  });
};

module.exports = InstanceProperty;
