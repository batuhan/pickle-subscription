const _ = require("lodash");
const async = require("async");
const NotificationTemplate = require("./base/entity")("notification_templates");
const Notification = require("./notifications");
const User = require("./user");
const Role = require("./role");
const knex = require("../config/db");
const store = require("../config/redux/store");
const { put, call, fork, all } = require("redux-saga/effects");
const mailer = require("../lib/mailer");

/**
 *
 * @param map -
 * @param callback
 */
NotificationTemplate.prototype.getRoles = function(callback) {
  const templateId = this.get("id");
  knex(Role.table)
    .whereIn("id", function() {
      this.select("role_id")
        .from("notification_templates_to_roles")
        .where("notification_template_id", templateId);
    })
    .then(function(result) {
      callback(result.map(p => new Role(p)));
    })
    .catch(function(err) {
      console.log(err);
    });
};

NotificationTemplate.prototype.setRoles = function(roleIds, callback) {
  const templateId = this.get("id");
  const links = [];
  knex("notification_templates_to_roles")
    .where("notification_template_id", templateId)
    .delete()
    .then(function(result) {
      roleIds.forEach(id => {
        const notificationToRole = {
          role_id: id,
          notification_template_id: templateId,
        };
        links.push(notificationToRole);
      });
      knex("notification_templates_to_roles")
        .insert(links)
        .then(callback);
    });
};
NotificationTemplate.prototype.build = function(map, callback) {
  const parseTemplate = function(match, replaceString, offset, string) {
    const splitStr = replaceString.split(".");
    if (splitStr.length > 1) {
      splitStr[1] += "[0]";
      replaceString = splitStr.join(".");
    }
    return _.get(map, replaceString);
  };

  const regex = /\[\[([\w, \.]+)]]/gm;
  const message = this.get("message").replace(regex, parseTemplate);
  const subject = this.get("subject").replace(regex, parseTemplate);

  callback(message, subject);
};

const createNotifications = function(
  recipients,
  message,
  subject,
  notificationTemplate,
) {
  if (notificationTemplate.get("create_notification")) {
    console.log("CREATING A NOTIFICATION!");
    return Promise.all(
      recipients.map(recipient => {
        return new Promise((resolve, reject) => {
          const notificationAttributes = {
            message,
            user_id: recipient.get("id"),
            subject,
          };
          // Create Notification
          const newNotification = new Notification(notificationAttributes);
          newNotification.create(function(err, notification) {
            if (!err) {
              console.log(`notification created: ${notification.get("id")}`);
              return resolve(notification);
            }
            return reject(err);
          });
        }).catch(e => {
          console.log("error when creating notification: ", e);
        });
      }),
    );
  }
  console.log("no notifications to create");
  return true;
};

const createEmailNotifications = function(
  recipients,
  message,
  subject,
  notificationTemplate,
) {
  if (notificationTemplate.get("send_email")) {
    const additionalRecipients = notificationTemplate.get(
      "additional_recipients",
    );
    let emailArray = recipients.map(recipient => recipient.get("email"));
    emailArray = _.union(emailArray, additionalRecipients);
    console.log("email array");
    console.log(emailArray);
    return Promise.all(
      emailArray.map(email => {
        return new Promise(resolve => {
          mailer(email, message, subject);
          return resolve();
        });
      }),
    ).catch(e => {
      console.log("error sending email notifications", e);
    });
  }
  console.log("no emails to send");
  return true;
};

NotificationTemplate.prototype.createNotification = function*(object) {
  const self = (yield call(NotificationTemplate.find, {
    id: this.get("id"),
  }))[0];
  const notificationContent = yield call(getNotificationContents, self, object);
  const usersToNotify = yield call(getRoleUsers, self);

  if (self.get("send_to_owner")) {
    // todo: saga
    const owner = yield new Promise((resolve, reject) => {
      const userId =
        self.get("model") === "user" ? object.get("id") : object.get("user_id");
      User.findOne("id", userId, function(user) {
        resolve(user);
      });
    });
    usersToNotify.push(owner);
  }
  return yield all([
    fork(
      createEmailNotifications,
      usersToNotify,
      notificationContent.message,
      notificationContent.subject,
      self,
    ),
    fork(
      createNotifications,
      usersToNotify,
      notificationContent.message,
      notificationContent.subject,
      self,
    ),
  ]);
};

let getNotificationContents = function(template, targetObject) {
  return new Promise(function(resolve, reject) {
    // Attach references
    targetObject.attachReferences(updatedObject => {
      const store = require("../config/redux/store");
      const globalProps = store.getState().options;
      const map = { ...updatedObject.data };
      Object.keys(globalProps).forEach(
        key => (map[`_${key}`] = globalProps[key]),
      );
      return resolve(map);
    });
  })
    .then(updatedObject => {
      return new Promise(function(resolve, reject) {
        // Build Message and Subject from template
        template.build(updatedObject, function(message, subject) {
          console.log("Built Notification message");
          return resolve({ message, subject });
        });
      });
    })
    .catch(e => {
      console.log("error when getting notification contents: ", e);
    });
};

let getRoleUsers = function(template) {
  return new Promise(function(resolve, reject) {
    template.getRoles(function(roles) {
      console.log(roles);
      resolve(roles);
    });
  })
    .then(result =>
      Promise.all(
        result.map(role => {
          return new Promise(resolve => {
            role.getUsers(users => {
              return resolve(users);
            });
          });
        }),
      ),
    )
    .then(usersInRoles => {
      const users = usersInRoles.reduce(
        (allUsers, userInRole) => allUsers.concat(userInRole),
        [],
      );
      return users;
    })
    .catch(e => {
      console.log("error when getting list of users from roles: ", e);
    });
};

module.exports = NotificationTemplate;
