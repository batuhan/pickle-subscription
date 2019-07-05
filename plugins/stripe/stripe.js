const consume = require("pluginbot/effects/consume");
const { call } = require("redux-saga/effects");
const PluginOption = require("../../models/services/pluginOption");

const run = function*(config, provide, services) {
  const database = yield consume(services.database);
  // todo: move this to some installation script when it's more fleshed out

  const routeDefinition = [
    require("./api/webhook")(database),
    ...require("./api/reconfigure")(database),
    require("./api/import")(database),
  ];

  yield call(database.createTableIfNotExist, "stripe_event_logs", function(
    table,
  ) {
    table.inherits("event_logs");
    table.string("event_id");
    console.log("Created 'stripe_event_logs' table.");
  });

  yield provide({ routeDefinition });
  const updateCustomers = async () => {
    console.log("Updating customers");
    const delay = time => new Promise(res => setTimeout(() => res(), time));
    const User = require("../../models/user");
    const Invoice = require("../../models/invoice");
    const users = await User.find();
    await delay(50000);
    for (const user of users) {
      await Invoice.fetchUserInvoices(user)
        .then(function(updated_invoices) {
          // console.log(`Invoices Updated for user: ${user.data.email}`);
        })
        .catch(function(err) {
          // console.log(`Invoice Skipped for user: ${user.data.email}`);
          console.log(err);
        });
      await delay(200);
      Invoice.fetchUpcomingInvoice(user, function(upcoming_invoice) {
        // console.log(`Upcoming Invoice Updated for user: ${user.data.email}`);
      });
    }
    console.log("Fetching invoices done");
  };
  // Update customer invoices every hour
  setInterval(updateCustomers, 18000000);
  updateCustomers();
};

module.exports = { run };
