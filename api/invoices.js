const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const Invoice = require("../models/invoice");
const User = require("../models/user");

module.exports = function(router) {
  /**
   * Pre-check before the Entity Route
   * Update the user invoices prior to rendering it
   */
  router.get("/invoices/own", auth(), function(req, res, next) {
    user = req.user;
    Invoice.fetchUserInvoices(user)
      .then(function(result) {
        next();
      })
      .catch(function(err) {
        console.error(err);
        next();
        // res.status(400).json({error: err});
      });
  });

  /**
   * Pre-check before the Entity Route
   * Update the user invoices prior to rendering it if the request has user_id
   */
  router.get("/invoices", auth(), function(req, res, next) {
    const {key} = req.query;
    // Only update the user invoices
    if (key == "user_id") {
      const {value} = req.query;
      User.findOne("id", value, function(user) {
        Invoice.fetchUserInvoices(user)
          .then(function(result) {
            next();
          })
          .catch(function(err) {
            console.error(err);
            next();
            // res.status(400).json({error: err});
          });
      });
    } else {
      next();
    }
  });

  /**
   * User GET User Upcoming Invoice API call
   */
  router.get(
    "/invoices/upcoming/:id",
    validate(User, "id"),
    auth(null, User, "id"),
    function(req, res) {
      const user = res.locals.valid_object;
      Invoice.getUpcomingInvoice(user, function(upcoming_invoice) {
        res.json(upcoming_invoice);
      });
    },
  );

  /**
   * Apply a refund to an invoice
   */
  router.post("/invoices/:id/refund", validate(Invoice), auth(), function(
    req,
    res,
  ) {
    const {amount} = req.body;
    const {reason} = req.body;
    const invoice = res.locals.valid_object;
    invoice.refund(amount, reason, function(err, refund) {
      if (!err) {
        res.status(200).json(refund);
      } else {
        res.status(400).json({ error: err });
      }
    });
  });

  // Override post route to hide adding invoices
  router.post(`/invoices`, function(req, res, next) {
    res.sendStatus(404);
  });

  // Override post route to hide deleting invoices
  router.delete(`/invoices/:id(\\d+)`, function(req, res, next) {
    res.sendStatus(404);
  });

  // Override post route to hide updating invoices
  router.put(`/invoices/:id(\\d+)`, function(req, res, next) {
    res.sendStatus(404);
  });

  // Extend Entity
  require("./entity")(router, Invoice, "invoices", "user_id");

  return router;
};
