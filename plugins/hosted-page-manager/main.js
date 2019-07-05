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
const mustache = require("mustache");
const fs = require("fs");
const jsonwebtoken = require("jsonwebtoken");
const { join } = require("path");

const EXP = 24; // hours before link expires
function* run(config, provide, channels) {
  const database = yield consume(channels.database);
  const store = require("../../config/redux/store");
  yield call(database.createTableIfNotExist, "embed_configurations", function(
    table,
  ) {
    table.text("config");
    table.string("name");
    console.log("Created 'embed_configurations' table.");
  });

  yield call(database.createTableIfNotExist, "embed_access_tokens", function(
    table,
  ) {
    table.string("token");
    table.timestamp("expiration");
    table
      .integer("user_id")
      .references("users.id")
      .onDelete("cascade");
    console.log("Created 'embed_access_tokens' table.");
  });

  function createToken(userId) {
    return new Promise(async resolve => {
      require("crypto").randomBytes(20, async function(err, buffer) {
        const token = buffer.toString("hex");
        await database("embed_access_tokens").insert({
          user_id: userId,
          token,
          expiration: new Date(new Date().getTime() + 60 * 60 * EXP * 1000),
        });
        resolve(token);
      });
    });
  }
  const router = yield consume(channels.pageRouter);
  async function validateToken(token, userId) {
    const entry = (await database("embed_access_tokens").where({
      token,
      user_id: userId,
    }))[0];
    if (!entry) {
      throw "No Token Found";
    }
    if (new Date(entry.expiration) < new Date()) {
      throw "Token Expired";
    }
    return true;
  }
  async function sendLink(req, res) {
    try {
      const { userId } = req.params;
      const user = (await database("users").where({ id: userId }))[0];
      if (!user) {
        return res.status(400).json({ error: "User doesn't exist" });
      }

      const token = await createToken(userId);

      const mailer = require("../../lib/mailer");

      mailer(
        user.email,
        `Access to billing account with ${
          store.getState().options.company_name
        } was requested, go <a href="${createLink(
          userId,
          token,
        )}">here</a> to access your billing settings - this link will only work for ${EXP} hours`,
        "Billing Dashboard Access",
      );
      res.status(200).json({ message: "Link sent" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e });
    }
  }

  function createLink(userId, token) {
    return `https://${
      store.getState().options.hostname
    }/page/billing?user=${userId}&token=${token}`;
  }

  async function generateJWT(req, res) {
    const { userId, token } = req.params;
    try {
      if (await validateToken(token, userId)) {
        const token = jsonwebtoken.sign(
          { uid: userId },
          process.env.SECRET_KEY,
          { expiresIn: "3h" },
        );
        res.json({ token });
      }
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }
  const routeDefinition = [
    {
      endpoint: "/auth/link/:userId/generate",
      method: "post",
      middleware: [sendLink],
      permissions: [],
      description: "Generate and email a new link to userId",
    },
    {
      endpoint: "/auth/link/:userId/:token/jwt",
      method: "post",
      middleware: [generateJWT],
      permissions: [],
      description: "Generate a new JWT from link token",
    },
  ];
  const embedAccessManager = {
    createToken,
    createLink,
  };
  yield provide({ routeDefinition, embedAccessManager });
  while (true) {
    const { path, name, needsToken } = yield consume(channels.hostedPage);

    database("embed_configurations")
      .where("name", name)
      .then(async config => {
        if (config.length === 0) {
          await database("embed_configurations").insert({
            name,
          });
        }
      });

    router.get(`/${name}`, async function(req, res) {
      try {
        let jwt = null;
        if (needsToken) {
          const { user, token } = req.query;
          try {
            if (await validateToken(token, user)) {
              jwt = jsonwebtoken.sign({ uid: user }, process.env.SECRET_KEY, {
                expiresIn: "3h",
              });
            }
          } catch (e) {
            console.error("bad token", e);
            fs.readFile(
              join(__dirname, "./default.handlebars"),
              "utf8",
              async function(err, data) {
                res.send(mustache.render(data));
              },
            );
            return;
          }
        }
        fs.readFile(path, "utf8", async function(err, data) {
          const embedConfiguration =
            (await database("embed_configurations")
              .returning("*")
              .where("name", name))[0].config || "{}";
          const url = `https://${store.getState().options.hostname}`;
          try {
            const rendered = mustache.render(data, {
              dbConfig: `var dbConfig = ${embedConfiguration}`,
              query: req.query,
              generatedConfig: `var genConfig = {
                            selector: document.getElementById('servicebot-hosted-embeddable'),
                            url: "${url}",
                            token: "${jwt}"
                        }`,
            });
            res.send(rendered);
          } catch (e) {
            console.error(e);
          }
        });
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
      }
    });
  }
}
module.exports = { run };
