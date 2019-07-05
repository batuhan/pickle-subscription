const async = require("async");
const charge = require("../../models/charge");
const serviceInstance = require("../../models/service-instance");
const serviceInstanceCancellation = require("../../models/service-instance-cancellation");
const serviceInstanceProperty = require("../../models/service-instance-property");
const serviceTemplate = require("../../models/service-template");
const transaction = require("../../models/transaction");
const invoice = require("../../models/invoice");
const user = require("../../models/user");
const fund = require("../../models/fund");
const webhook = require("../../models/base/entity")("webhooks");

const properties = require("../../models/system-options");

// Reusable functions
const getARR = function(payPlan) {
  let arr = 0;
  // Build the logic for ARR & MRR
  if (payPlan) {
    if (payPlan.interval === "day") {
      arr += payPlan.amount * (365 / payPlan.interval_count);
    } else if (payPlan.interval === "week") {
      arr += payPlan.amount * (52 / payPlan.interval_count);
    } else if (payPlan.interval === "month") {
      arr += payPlan.amount * (12 / payPlan.interval_count);
    } else if (payPlan.interval === "year") {
      arr += payPlan.amount / payPlan.interval_count;
    }
  }
  return arr;
};
const getFunding = function(users, funds, instance) {
  const fundingData = {
    hasFunding: false,
    fundingCount: 0,
    flagged: false,
    flagCount: 0,
  };
  // Check if account is paid
  const fundAvailable = funds.filter(
    card => card.data.user_id === instance.data.user_id,
  );
  const user = users.filter(user => user.data.id === instance.data.user_id);
  if (fundAvailable.length > 0) {
    // if(user.length > 0 && user[0].data.status !== 'flagged') {
    if (user.length > 0) {
      fundingData.hasFunding = true;
      fundingData.fundingCount++;
    }
    if (user.length > 0 && user[0].data.status === "flagged") {
      fundingData.flagged = true;
      fundingData.flagCount++;
    }
  }
  return fundingData;
};

module.exports = {
  getAnalyticsData: () => {
    return new Promise(async (resolve, reject) => {
      const props = (await properties.find()).reduce((acc, prop) => {
        acc[prop.data.option] = prop.data.value;
        return acc;
      }, {});
      const users = await user.find();
      const funds = await fund.find();
      const templates = await serviceTemplate.find();
      const instances = await serviceInstance.find();
      const charges = await charge.find();
      const transactions = await transaction.find();
      const invoices = await invoice.find();
      async.parallel(
        {
          customerStats(callback) {
            const stats = {};
            stats.total = users.length;
            stats.active = stats.invited = stats.flagged = stats.fundsTotal = 0;
            users.map(user => {
              if (user.data.status === "active") {
                stats.active++;
              } else if (user.data.status === "invited") {
                stats.invited++;
              } else if (user.data.status === "flagged") {
                stats.flagged++;
              }
              fund.getRowCountByKey("user_id", user.data.id, hasFund => {
                if (hasFund > 0) stats.fundsTotal++;
              });
            });
            callback(null, stats);
          },
          offeringStats(callback) {
            const stats = {};
            stats.total = templates.length;
            callback(null, stats);
          },
          salesStats(callback) {
            const stats = {};
            let activeSales = (requested = waitingCancellation = cancelled = subCancelled = 0);
            const usersWithActiveOffering = [];
            let arr = (arrForecast = 0);
            let inTrial = (inTrialPaying = inPaying = inFlagged = inPayingCancelled = 0);
            let subActive = (subAnnual = subTotalCharges = subPaidCharges = 0);
            let singleActive = (singleAllCharges = singleApproved = singleWaiting = 0);
            let customActive = (customTotalAmt = customTotalPaidAmt = 0);
            let allCharges = (allChargesApproved = 0);
            instances.map(instance => {
              // Currently most analytical data is from the active instances.
              if (instance.data.subscription_id !== null) {
                activeSales++;
                usersWithActiveOffering.push(instance.data.user_id);
                if (instance.data.type === "subscription") {
                  subActive++;
                  const payPlan = instance.data.payment_plan;
                  const trial = instance.data.payment_plan.trial_period_days;
                  const trialEnd = instance.data.trial_end;
                  // Get forecast ARR
                  arrForecast += getARR(payPlan);
                  const currentDate = new Date();
                  const trialEndDate = new Date(trialEnd * 1000);
                  const userFunding = getFunding(users, funds, instance);
                  // If user is paying, then add to ARR
                  if (userFunding.fundingCount > 0) {
                    arr += getARR(payPlan);
                  }
                  // Service is trialing if the expiration is after current date
                  if (trial > 0 && currentDate < trialEndDate) {
                    inTrial++;
                    inTrialPaying += userFunding.fundingCount;
                  }
                  // Check if account is paid
                  inPaying += userFunding.fundingCount;
                  inFlagged += userFunding.flagCount;
                } else if (instance.data.type === "one_time") {
                  singleActive++;
                } else if (instance.data.type === "custom") {
                  customActive++;
                }
              }
              // Check for types
              if (instance.data.status === "requested") {
                requested++;
              } else if (instance.data.status === "waiting_cancellation") {
                waitingCancellation++;
              } else if (instance.data.status === "cancelled") {
                cancelled++;
                if (instance.data.type === "subscription") {
                  subCancelled++;
                }
                // Find the paying cancelled accounts
                inPayingCancelled += getFunding(users, funds, instance)
                  .fundingCount;
              }
            });
            charges.map(charge => {
              allCharges += charge.data.amount;
              if (charge.data.item_id !== null) {
                allChargesApproved += charge.data.amount;
              }
            });
            // Calculate multi-level metrics
            let averageConversion = 0;
            if (inPaying > 0) {
              averageConversion = inPaying / (subActive + subCancelled);
            }
            // Calculate ARPA & Churn
            let arpa = 0;
            let churn = 0;
            if (inPaying > 0) {
              arpa = (Math.ceil(arr / 12) / inPaying).toFixed(2);
              churn = (
                (inPayingCancelled / (inPaying + inPayingCancelled)) *
                100
              ).toFixed(2);
            }

            stats.overall = {};
            stats.overall.total = instances.length;
            stats.overall.activeSales = activeSales;
            stats.overall.requested = requested;
            stats.overall.waitingCancellation = waitingCancellation;
            stats.overall.cancelled = cancelled;
            stats.overall.customersWithOfferings = Array.from(
              new Set(usersWithActiveOffering),
            ).length;
            stats.overall.remainingCharges =
              subTotalCharges -
              subPaidCharges +
              singleWaiting +
              (customTotalAmt - customTotalPaidAmt);
            stats.subscriptionStats = {};
            stats.subscriptionStats.all = subActive + subCancelled;
            stats.subscriptionStats.running = subActive;
            stats.subscriptionStats.active = subActive - inTrial;
            stats.subscriptionStats.cancelled = subCancelled;
            stats.subscriptionStats.paying = inPaying;
            stats.subscriptionStats.trials = inTrial;
            stats.subscriptionStats.trialPaying = inTrialPaying;
            stats.subscriptionStats.flagged = inFlagged;
            stats.subscriptionStats.payingCancelled = inPayingCancelled;
            stats.subscriptionStats.arrForecast = Math.ceil(
              (arrForecast - arr) * averageConversion + arr,
            );
            stats.subscriptionStats.mrrForecast = Math.ceil(arrForecast / 12);
            stats.subscriptionStats.arr = Math.ceil(arr);
            stats.subscriptionStats.mrr = Math.ceil(arr / 12);
            stats.subscriptionStats.arpa = arpa;
            stats.subscriptionStats.churn = churn;
            stats.subscriptionStats.averageConversion = (
              averageConversion * 100
            ).toFixed(2);
            stats.subscriptionStats.totalCharges = subTotalCharges;
            stats.subscriptionStats.totaPaidCharges = subPaidCharges;
            stats.subscriptionStats.totalRemainingCharges =
              subTotalCharges - subPaidCharges;
            stats.oneTimeStats = {};
            stats.oneTimeStats.allCharges = allCharges;
            stats.oneTimeStats.approvedCharges = allChargesApproved;
            callback(null, stats);
          },
          hasStripeKeys(callback) {
            callback(
              null,
              props.stripe_publishable_key != null &&
                props.stripe_secret_key != null,
            );
          },
          isLive(callback) {
            callback(
              null,
              props.stripe_publishable_key &&
                props.stripe_publishable_key.substring(3, 7).toUpperCase() ===
                  "LIVE",
            );
          },
          hasChangedHeader(callback) {
            callback(
              null,
              props.home_featured_heading !==
                "Start selling your offerings in minutes!",
            );
          },
          totalCustomers(callback) {
            user.getRowCountByKey(null, null, function(totalCustomers) {
              callback(null, totalCustomers);
            });
          },
          totalFlaggedCustomers(callback) {
            fund.getRowCountByKey("flagged", "true", function(totalUsers) {
              callback(null, totalUsers);
            });
          },
          totalServiceInstances(callback) {
            serviceInstance.getRowCountByKey(null, null, function(
              totalInstances,
            ) {
              callback(null, totalInstances);
            });
          },
          totalRequestedServiceInstances(callback) {
            serviceInstance.getRowCountByKey("status", "requested", function(
              totalInstances,
            ) {
              callback(null, totalInstances);
            });
          },
          totalRunningServiceInstances(callback) {
            serviceInstance.getRowCountByKey("status", "running", function(
              totalInstances,
            ) {
              callback(null, totalInstances);
            });
          },
          totalWaitingServiceInstances(callback) {
            serviceInstance.getRowCountByKey("status", "waiting", function(
              totalInstances,
            ) {
              callback(null, totalInstances);
            });
          },
          totalMissingPaymentServiceInstances(callback) {
            serviceInstance.getRowCountByKey(
              "status",
              "missing-payment",
              function(totalInstances) {
                callback(null, totalInstances);
              },
            );
          },
          totalCancelledServiceInstances(callback) {
            serviceInstance.getRowCountByKey("status", "cancelled", function(
              totalInstances,
            ) {
              callback(null, totalInstances);
            });
          },
          totalRejectedServiceInstances(callback) {
            serviceInstance.getRowCountByKey("status", "rejected", function(
              totalInstances,
            ) {
              callback(null, totalInstances);
            });
          },
          totalWaitingCancellationServiceInstances(callback) {
            serviceInstance.getRowCountByKey(
              "status",
              "waiting_cancellation",
              function(totalInstances) {
                callback(null, totalInstances);
              },
            );
          },
          totalChargeItems(callback) {
            charge.getRowCountByKey(null, null, function(totalCharges) {
              callback(null, totalCharges);
            });
          },
          totalPaidChargeItems(callback) {
            charge.getRowCountByKey("approved", "true", function(
              totalSuccessfulCharges,
            ) {
              callback(null, totalSuccessfulCharges);
            });
          },
          totalUnpaidChargeItems(callback) {
            charge.getRowCountByKey("approved", "false", function(
              totalUnsuccessfulCharges,
            ) {
              callback(null, totalUnsuccessfulCharges);
            });
          },
          totalApprovedChargeItems(callback) {
            charge.getRowCountByKey("approved", "true", function(
              totalApprovedCharges,
            ) {
              callback(null, totalApprovedCharges);
            });
          },
          totalRefunds(callback) {
            transaction.getRowCountByKey("refunded", "true", function(
              totalRefunds,
            ) {
              callback(null, totalRefunds);
            });
          },
          totalRefundAmount(callback) {
            transaction.getSumOfColumnFiltered(
              "amount_refunded",
              null,
              null,
              function(totalRefundAmount) {
                const total = totalRefundAmount == null ? 0 : totalRefundAmount;
                callback(null, total);
              },
            );
          },
          totalWebhooks(callback) {
            webhook.getRowCountByKey(null, null, total => {
              callback(null, total);
            });
          },
          totalInvoiced(callback) {
            let total = 0;
            invoices.map(inv => {
              total += inv.data.total;
            });
            callback(null, total);
          },
          totalSales(callback) {
            let total = 0;
            transactions.map(payment => {
              if (payment.data.paid === true) {
                total += payment.data.amount;
              }
            });
            callback(null, total);
          },
          totalServiceInstanceCancellations(callback) {
            serviceInstanceCancellation.getRowCountByKey(null, null, function(
              totalCancellations,
            ) {
              callback(null, totalCancellations);
            });
          },
          totalPublishedTemplates(callback) {
            serviceTemplate.getRowCountByKey("published", "true", function(
              totalPublishedTemplates,
            ) {
              callback(null, totalPublishedTemplates);
            });
          },
          totalUnpublishedTemplates(callback) {
            serviceTemplate.getRowCountByKey("published", "false", function(
              totalUnpublishedTemplates,
            ) {
              callback(null, totalUnpublishedTemplates);
            });
          },
        },
        function(err, results) {
          if (err) {
            console.error(err);
            return reject(err);
          }
          resolve(results);
        },
      );
      // whatever
    });
  },
};
