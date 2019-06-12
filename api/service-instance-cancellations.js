const ServiceInstanceCancellations = require("../models/service-instance-cancellation");
const ServiceInstance = require("../models/service-instance");
const EventLogs = require("../models/event-log");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
module.exports = function(router) {
  const store = require("../config/redux/store");

  //TODO add updated time stamp thingy
  router.post(
    "/service-instance-cancellations/:id/approve",
    validate(ServiceInstanceCancellations),
    auth(),
    async function(req, res, next) {
      const entity = res.locals.valid_object;
      try {
        //Only approve is the request is waiting
        if (entity.data.status === "waiting") {
          const service_instance = (await ServiceInstance.find({
            id: entity.get("service_instance_id"),
          }))[0];
          entity.set("status", "approved");
          entity.set("fulfilled_by", req.user.get("id"));
          await entity.update();
          const unsub_obj = await service_instance.unsubscribe();
          res.status(200).json(unsub_obj);
          store.dispatchEvent(
            "service_instance_cancellation_approved",
            unsub_obj,
          );
          next();
        } else {
          res
            .status(400)
            .json({ error: "Cancellation has already been processed." });
        }
      } catch (err) {
        res.status(400).json({ error: "Error cancelling the service!" });
      }
    },
  );

  router.post(
    "/service-instance-cancellations/:id/reject",
    validate(ServiceInstanceCancellations),
    auth(),
    function(req, res, next) {
      const entity = res.locals.valid_object;
      //Only approve is the request is waiting
      if (entity.data.status === "waiting") {
        ServiceInstance.findOne(
          "id",
          entity.get("service_instance_id"),
          function(service_instance) {
            entity.set("status", "rejected");
            entity.set("fulfilled_by", req.user.get("id"));
            entity.update(function(err, result) {
              service_instance.data.status = "running";
              service_instance.update(function(err, instance_obj) {
                EventLogs.logEvent(
                  req.user.get("id"),
                  `service-instance-cancellations ${
                    req.params.id
                  } was rejected by user ${req.user.get("email")}`,
                );
                res.status(200).json(instance_obj);
                store.dispatchEvent(
                  "service_instance_cancellation_rejected",
                  result,
                );
                next();
              });
            });
          },
        );
      } else {
        res
          .status(400)
          .json({ error: "Cancellation has already been processed." });
      }
    },
  );

  //route for users to reject their own cancellation request
  router.post(
    "/service-instance-cancellations/:id/undo",
    validate(ServiceInstanceCancellations),
    auth(null, ServiceInstanceCancellations),
    function(req, res) {
      const entity = res.locals.valid_object;
      //Only approve is the request is waiting
      if (entity.data.status === "waiting") {
        ServiceInstance.findOne(
          "id",
          entity.get("service_instance_id"),
          function(service_instance) {
            entity.set("status", "rejected");
            entity.set("fulfilled_by", req.user.get("id"));
            entity.update(function() {
              service_instance.data.status = "running";
              service_instance.update(function(err, instance_obj) {
                EventLogs.logEvent(
                  req.user.get("id"),
                  `service-instance-cancellations ${
                    req.params.id
                  } was rejected by user ${req.user.get("email")}`,
                );
                res.status(200).json(instance_obj);
              });
            });
          },
        );
      } else {
        res
          .status(400)
          .json({ error: "Cancellation has already been processed." });
      }
    },
  );

  require("./entity")(
    router,
    ServiceInstanceCancellations,
    "service-instance-cancellations",
  );

  return router;
};
