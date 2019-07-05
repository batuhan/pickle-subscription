const consume = require("pluginbot/effects/consume");

const run = function*(config, provide, services) {
  const database = yield consume(services.database);
  const analytics = yield consume(services.analytics);
  const request = require("request");
  const semver = require("semver");
  const _ = require("lodash");
  const { master } = config;
  const { interval } = config; // 24 hours
  const Notification = require("../../models/notifications");
  const { dispatchEvent } = require("../../config/redux/store");
  const salt = process.env.INSTANCE_SALT;
  // let hash = require("bcryptjs").hashSync(salt, 10).toString("hex");
  const checkMaster = async function() {
    const version = process.env.npm_package_version;

    const data = await analytics.getAnalyticsData();
    const statsToGet = [
      "totalCustomers",
      "totalFlaggedCustomers",
      "totalServiceInstances",
      "totalServiceInstanceCancellations",
      "totalPublishedTemplates",
      "totalUnpublishedTemplates",
    ];
    const stats = _.pick(data, statsToGet);
    // for each metricName metricValue pair (entries) create a string of metricName=metricValue and join all by & to create query string for url
    const query = Object.entries(stats)
      .map(metric => {
        return `${metric[0]}=${metric[1]}`;
      })
      .join("&");
    const url = `${master}?instance_hash=${salt}&version=${version}&${query}`;
    console.log(url);

    request(url, function(error, response, body) {
      // console.log(response);
      if (error) {
        console.log("error");
        console.log(error);
      } else {
        try {
          return Promise.all(
            JSON.parse(body).notifications.map(notification => {
              const { data } = notification;
              return Notification.createPromise(data)
                .then(result => {
                  store.dispatchEvent("master_notification_created", result);
                  return result;
                })
                .catch(err => {
                  if (err.code != "23505") {
                    console.error(
                      `Error inserting notification`,
                      notification,
                      err,
                    );
                  }
                });
            }),
          );
        } catch (e) {
          console.error(`error connecting to hub: ${e}`);
        }
      }
    });

    setTimeout(checkMaster, interval);
  };

  checkMaster();
};

module.exports = { run };
