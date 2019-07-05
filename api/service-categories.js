const auth = require("../middleware/auth");
const ServiceCategories = require("../models/service-category");

module.exports = function(router) {
  router.get("/service-categories", function(req, res, next) {
    if (!req.isAuthenticated()) {
      let { key } = req.query;
      let { value } = req.query;
      if (!key || !value) {
        key = undefined;
        value = undefined;
      }
      ServiceCategories.findAll(key, value, function(templates) {
        res.json(templates.map(entity => entity.data));
      });
    } else {
      next();
    }
  });
  require("./entity")(router, ServiceCategories, "service-categories");

  return router;
};
