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
const bcrypt = require("bcryptjs");

function* run(config, provide, channels) {
  const db = yield consume(channels.database);
  const userProviders = {
    local: {
      async update(oldUser, newUserData) {
        newUserData.id = oldUser.get("id");
        if (newUserData.password) {
          newUserData.password = bcrypt.hashSync(newUserData.password, 10);
        }
        Object.assign(oldUser.data, newUserData);
        console.log("updating the user");
        try {
          const result = await oldUser.updateWithStripe();
          delete result.password;
          return {
            message: "User is successfully updated",
            results: result,
          };
        } catch (e) {
          return { error: e };
        }
      },
      authenticate(user, password) {
        if (!bcrypt.compareSync(password, user.get("password"))) {
          throw "Invalid username/password";
        }
      },
    },
  };
  const userManager = {
    async update(user, userData) {
      if (user.data.id) {
        try {
          const { provider } = user.data;
          delete userData.provider;
          if (
            provider !== "local" &&
            userProviders[provider] &&
            userProviders[provider].update
          ) {
            const providerResult = await userProviders[provider].update(
              user,
              userData,
            );
            console.log("PROVIDER RESULT\n\n", providerResult);
          }
          return await userProviders.local.update(user, userData);
        } catch (e) {
          return { error: e };
        }
      }
    },
    async authenticate(user, password) {
      if (user.data.id) {
        const provider = user.data.provider || "local";
        return await userProviders[provider].authenticate(user, password);
      }
    },
  };
  yield provide({ userManager });

  while (true) {
    const userProvider = yield consume(channels.userProvider);
    userProviders[userProvider.name] = userProvider;
  }
}
module.exports = { run };
