const NotificationTemplate = require("../models/notification-template");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

module.exports = function(router) {
  router.get(
    "/notification-templates/:id(\\d+)",
    validate(NotificationTemplate),
    auth(),
    function(req, res) {
      const modelName = res.locals.valid_object.get("model");
      const model = require("../models/" + modelName);
      model.getSchema(true, false, function(result) {
        const template = res.locals.valid_object;
        template["schema"] = result;
        res.json(template);
      });
    },
  );

  router.get(
    "/notification-templates/:id(\\d+)/roles",
    validate(NotificationTemplate),
    auth(),
    function(req, res, next) {
      res.locals.valid_object.getRoles(function(roles) {
        res.locals.json = roles;
        next();
      });
    },
  );

  router.put(
    "/notification-templates/:id(\\d+)/roles",
    validate(NotificationTemplate),
    auth(),
    function(req, res, next) {
      res.locals.valid_object.setRoles(req.body, function(result) {
        res.locals.json = result;
        next();
      });
    },
  );

  require("./entity")(router, NotificationTemplate, "notification-templates");

  return router;
};
