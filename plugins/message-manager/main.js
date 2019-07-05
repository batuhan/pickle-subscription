const {
  call,
  put,
  all,
  select,
  fork,
  spawn,
  take,
} = require("redux-saga/effects");
const consume = require("pluginbot/effects/consume");

function* run(config, provide, channels) {
  const database = yield consume(channels.database);

  const messageManager = {
    async send(
      to_id,
      from_id,
      service_instance_id = 0,
      message,
      subject = "New message on your service",
    ) {
      // todo: mailer needs to be a server, messages should be direct DB Stuff once all the model stuff is moved

      const Messages = require("../../models/service-instance-message");
      const mailer = require("../../lib/mailer");

      const newMessage = await Messages.createPromise({
        user_id: from_id,
        service_instance_id,
        message,
      });
      const user = (await database("users").where("id", to_id))[0];
      mailer(user.email, message, subject);
      return newMessage;
    },
    getInstanceMessages: instance_id => {},
    getUserMessages: userId => {},
    getSentMessages: userId => {},
  };

  yield provide({ messageManager });
}
module.exports = { run };
