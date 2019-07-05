const async = require("async");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const NotificationTemplate = require("../models/notification-template");
const Role = require("../models/role");
const ResetRequest = require("../models/password-reset-request");
const User = require("../models/user");
const Alert = require("react-s-alert").default;
const store = require("../config/redux/store");

module.exports = function(app, passport) {
  app.post(
    "/auth/token",
    function(req, res, next) {
      if (req.body.strategy) {
        passport.authenticate(req.body.strategy)(req, res, next);
      } else {
        passport.authenticate("local-login", { session: false })(
          req,
          res,
          next,
        );
      }
    },
    async function(req, res) {
      const payload = { uid: req.user.data.id };
      if (req.query.includeUser) {
        await req.user.attachReferences();
        payload.user = req.user.data;
        delete payload.user.password;
        delete payload.user.references.funds;
      }
      const expiration = req.body.noExpiration ? undefined : "3h";
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: expiration,
      });
      res.json({ token });
    },
  );

  app.get("/auth/session/clear", function(req, res) {
    res.clearCookie("permissions", { path: "/" });
    res.clearCookie("username", { path: "/" });
    res.clearCookie("uid", { path: "/" });
    req.logout();
    res.json({ message: "successful logout" });
  });

  app.post("/auth/reset-password", function(req, res, next) {
    User.findOne("email", req.body.email, function(user) {
      if (user.data) {
        ResetRequest.findAll("user_id", user.get("id"), function(requests) {
          async.each(
            requests,
            function(request, callback) {
              request.delete(function(result) {
                callback();
              });
            },
            function(err) {
              require("crypto").randomBytes(20, function(err, buffer) {
                const token = buffer.toString("hex");
                const reset = new ResetRequest({
                  user_id: user.get("id"),
                  hash: bcrypt.hashSync(token, 10),
                });
                reset.create(function(err, newReset) {
                  const resetURL = store.getState().options.reset_url;
                  let frontEndUrl = `${req.protocol}://${req.get(
                    "host",
                  )}/reset-password/${user.get("id")}/${token}`;
                  if (resetURL) {
                    frontEndUrl = `${resetURL}?uid=${user.get(
                      "id",
                    )}&resetToken=${token}`;
                  }
                  res.json({ message: "Success" });
                  user.set("token", token);
                  user.set("url", frontEndUrl);
                  store.dispatchEvent("password_reset_request_created", user);
                  // mailer('password_reset', 'user_id', newReset)(req, res, next);
                });
              });
            },
          );
        });
      } else {
        res.json({ message: "Reset link sent" });
      }
    });
  });

  app.get("/auth/reset-password/:uid/:token", function(req, res, next) {
    ResetRequest.findOne("user_id", req.params.uid, function(result) {
      if (
        result.data &&
        bcrypt.compareSync(req.params.token, result.get("hash"))
      ) {
        res.status(200).json({ isValid: true });
      } else {
        res.status(400).json({ isValid: false, error: "Invalid Reset Link" });
      }
    });
  });

  // todo -- token expiration
  app.post("/auth/reset-password/:uid/:token", function(req, res, next) {
    const userManager = store.getState(true).pluginbot.services.userManager[0];

    ResetRequest.findOne("user_id", req.params.uid, function(result) {
      if (
        result.data &&
        bcrypt.compareSync(req.params.token, result.get("hash"))
      ) {
        User.findOne("id", result.get("user_id"), async function(user) {
          // let password = bcrypt.hashSync(req.body.password, 10);
          const newUserData = { password: req.body.password };
          const updated = await userManager.update(user, newUserData);
          // user.set("password", password);
          res.json({ message: "Password successfully reset" });
          result.delete(function(r) {});
        });
      } else {
        res.status(400).json({ error: "Invalid Reset Link" });
      }
    });
  });

  app.post(
    "/auth/session",
    function(req, res, next) {
      const cb = function(err, user, info) {
        if (err) {
          console.error(err);
          return res.json({ error: "Invalid username or password" });
        }
        if (!user) {
          console.error("no user");
          return res.json({ error: "Invalid username or password" });
        }
        req.logIn(user, { session: true }, function(err) {
          if (err) {
            return next(err);
          }
          user.set("last_login", new Date());
          user.update(function(err, result) {
            if (err) {
              return next(err);
            }
            return next();
          });
        });
      };
      if (req.body.strategy) {
        passport.authenticate(req.body.strategy, cb)(req, res, next);
      } else {
        passport.authenticate("local-login", cb)(req, res, next);
      }
    },
    require("../middleware/role-session")(),
    function(req, res, next) {
      const user_role = new Role({ id: req.user.data.role_id });
      user_role.getPermissions(function(perms) {
        const permission_names = perms.map(perm => perm.data.permission_name);
        res.json({
          message: "successful login",
          permissions: permission_names,
        });
      });
    },
  );
};
