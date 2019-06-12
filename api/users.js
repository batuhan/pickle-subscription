const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const User = require("../models/user");
const Invitation = require("../models/invitation");
const EventLogs = require("../models/event-log");
const multer = require("multer");
const File = require("../models/file");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
//todo - entity posting should have correct error handling, response should tell user what is wrong like if missing column
const avatarFilePath = "uploads/avatars";
const store = require("../config/redux/store");
const fileManager = store.getState(true).pluginbot.services.fileManager[0];

const uploadLimit = function() {
  return store.getState().options.upload_limit * 1000000;
};

const upload = () => {
  return multer({
    storage: fileManager.storage(avatarFilePath),
    limits: { fileSize: uploadLimit() },
  });
};

const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function(router) {
  router.get("/invitation/:invitation_id", function(req, res) {
    Invitation.findOne("token", req.params.invitation_id, function(result) {
      if (result.data) {
        return res.json({ status: "valid token" });
      } else {
        return res.status(404).json({ status: "bad token" });
      }
    });
  });

  router.get("/users/:id/avatar", validate(), auth(), function(req, res) {
    const id = req.params.id;
    File.findFile(avatarFilePath, id, function(avatar) {
      if (avatar.length > 0) {
        const file = avatar[0];
        fileManager.sendFile(file, res);
      } else {
        //todo: default avatar logic goes here
        const defaultAvatar = path.resolve(
          __dirname,
          "../public/assets/default/avatar-" + (id % 4) + ".png",
        );
        res.sendFile(defaultAvatar);
      }
    });
  });
  router.put("/users/:id/avatar", auth(), upload().single("avatar"), function(
    req,
    res,
  ) {
    const file = req.file;
    file.user_id = req.params.id;
    file.name = file.originalname;
    File.findFile(avatarFilePath, req.params.id, function(avatar) {
      if (avatar.length > 0) {
        const avatarToDelete = avatar[0];
        fileManager.deleteFile(avatarToDelete);
      }
      const avatarToCreate = new File(file);
      avatarToCreate.create(function(err, result) {
        result.message = "Avatar Upload!";
        res.json(result);
      });
    });
  });
  //TODO better error handling
  //TODO use next
  router.post(
    "/users/register",
    function(req, res, next) {
      const token = req.query.token;
      if (token) {
        Invitation.findOne("token", token, function(foundInvitation) {
          if (!foundInvitation.data) {
            res.status(500).send({ error: "invalid token specified" });
          } else {
            User.findById(foundInvitation.get("user_id"), function(newUser) {
              req.body.id = newUser.get("id");
              req.body.password = bcrypt.hashSync(req.body.password, 10);
              Object.assign(newUser.data, req.body);
              newUser.set("status", "active");
              newUser.update(function(err, updatedUser) {
                foundInvitation.delete(function() {
                  EventLogs.logEvent(
                    updatedUser.get("id"),
                    `user ${updatedUser.get("id")} ${updatedUser.get(
                      "email",
                    )} registered`,
                  );
                  res.locals.json = updatedUser.data;
                  res.locals.valid_object = updatedUser;
                  next();
                });
              });
            });
          }
        });
      } else if (res.locals.sysprops.allow_registration === "true") {
        if (req.body.name && req.body.email && req.body.password) {
          if (!req.body.email.match(mailRegex)) {
            res.status(400).json({ error: "Invalid email format" });
          } else {
            const newUser = new User(req.body);
            newUser.set("password", bcrypt.hashSync(req.body.password, 10));
            newUser.createWithStripe(function(err, result) {
              if (err) {
                res.status(403).json({ error: err });
              } else {
                res.locals.json = result.data;
                res.locals.valid_object = result;
                next();
              }
            });
          }
        } else {
          res
            .status(403)
            .json({ error: "Name, email, and password are all required!" });
        }
      } else {
        res.status(403).json({ error: "Registration disabled" });
      }
    },
    function(req, res, next) {
      req.logIn(res.locals.valid_object, { session: true }, function(err) {
        if (!err) {
          next();
        } else {
          console.error("Issue logging in: ", err);
          next();
        }
      });
    },
    require("../middleware/role-session")(),
    function(req, res, next) {
      const user_role = new Role({ id: req.user.data.role_id });
      user_role.getPermissions(function(perms) {
        const permission_names = perms.map(perm => perm.data.permission_name);
        res.locals.json = {
          message: "successful signup",
          permissions: permission_names,
        };
        store.dispatchEvent("user_registered", req.user);
        next();
      });
    },
  );

  //TODO add the registration url to the email
  router.post("/users/invite", auth(), function(req, res, next) {
    function reinviteUser(user) {
      const invite = new Invitation({ user_id: user.get("id") });
      invite.create(function(err, result) {
        if (!err) {
          const apiUrl =
            req.protocol +
            "://" +
            req.get("host") +
            "/api/v1/users/register?token=" +
            result.get("token");
          const frontEndUrl =
            req.protocol +
            "://" +
            req.get("host") +
            "/invitation/" +
            result.get("token");
          EventLogs.logEvent(
            req.user.get("id"),
            `users ${req.body.email} was reinvited by user ${req.user.get(
              "email",
            )}`,
          );
          res.locals.json = {
            token: result.get("token"),
            url: frontEndUrl,
            api: apiUrl,
          };
          user.set("url", frontEndUrl);
          user.set("api", apiUrl);
          res.locals.valid_object = result;
          next();
          store.dispatchEvent("user_invited", user);
        } else {
          res.status(403).json({ error: err });
        }
      });
    }
    if (req.body.hasOwnProperty("email")) {
      if (!req.body.email.match(mailRegex)) {
        res.status(400).json({ error: "Invalid email format" });
      } else {
        //get default_user_role
        const store = require("../config/redux/store");
        const globalProps = store.getState().options;
        const roleId = globalProps["default_user_role"];
        const newUser = new User({
          email: req.body.email,
          role_id: roleId,
          status: "invited",
        });
        User.findAll("email", req.body.email, function(foundUsers) {
          if (foundUsers.length !== 0) {
            Invitation.findOne("user_id", foundUsers[0].get("id"), invite => {
              if (invite && invite.data) {
                invite.delete(() => {
                  reinviteUser(foundUsers[0]);
                });
              } else {
                res
                  .status(400)
                  .json({ error: "This email already exists in the system" });
              }
            });
          } else {
            newUser.createWithStripe(function(err, resultUser) {
              if (!err) {
                const invite = new Invitation({
                  user_id: resultUser.get("id"),
                });
                invite.create(function(err, result) {
                  if (!err) {
                    const apiUrl =
                      req.protocol +
                      "://" +
                      req.get("host") +
                      "/api/v1/users/register?token=" +
                      result.get("token");
                    const frontEndUrl =
                      req.protocol +
                      "://" +
                      req.get("host") +
                      "/invitation/" +
                      result.get("token");
                    EventLogs.logEvent(
                      req.user.get("id"),
                      `users ${
                        req.body.email
                      } was invited by user ${req.user.get("email")}`,
                    );
                    res.locals.json = {
                      token: result.get("token"),
                      url: frontEndUrl,
                      api: apiUrl,
                    };
                    newUser.set("url", frontEndUrl);
                    newUser.set("api", apiUrl);
                    res.locals.valid_object = result;
                    next();
                    store.dispatchEvent("user_invited", newUser);
                  } else {
                    res.status(403).json({ error: err });
                  }
                });
              } else {
                res.status(403).json({ error: err });
              }
            });
          }
        });
      }
    } else {
      res.status(400).json({ error: "Must have property: email" });
    }
  });

  //Override post route to hide adding users
  router.post(`/users`, function(req, res) {
    res.sendStatus(404);
  });

  router.put(
    "/users/:id(\\d+)",
    validate(User),
    auth(null, User, "id"),
    async function(req, res) {
      //todo: this is dirty dirty way of getting plugin services... i want this code to be in plugin eventually
      const userManager = store.getState(true).pluginbot.services
        .userManager[0];
      if (!userManager) {
        console.error("User manager not defined...");
      }
      const oldUser = res.locals.valid_object;
      const newUserData = req.body;
      if (oldUser.get("id") === req.user.get("id")) {
        delete oldUser.data.role_id;
        delete newUserData.role_id;
        delete newUserData.status;
      } else if (newUserData.password && oldUser.get("status") === "invited") {
        newUserData.status = "active";
      }

      const updatedUser = await userManager.update(oldUser, newUserData);
      res.json(updatedUser);
    },
  );

  router.post(
    "/users/:id(\\d+)/suspend",
    validate(User),
    auth(null, User, "id"),
    async function(req, res) {
      const user = res.locals.valid_object;
      try {
        const updatedUser = await user.suspend();
        store.dispatchEvent("user_suspended", updatedUser);
        res.status(200).json(updatedUser);
      } catch (e) {
        res.status(400).json({ error: "Error suspending the user" });
      }
    },
  );

  router.post(
    "/users/:id(\\d+)/unsuspend",
    validate(User),
    auth(null, User, "id"),
    function(req, res) {
      const user = res.locals.valid_object;

      user.unsuspend(function(err, updated_user) {
        if (!err) {
          //dispatchEvent("user_unsuspended", user);
          res.status(200).json(updated_user);
        } else {
          res.status(400).json({ error: err });
        }
      });
    },
  );

  router.post(
    "/users/:id(\\d+)/token",
    validate(User),
    auth(null, User, "id"),
    function(req, res) {
      const user = res.locals.valid_object;
      const token = jwt.sign({ uid: user.data.id }, process.env.SECRET_KEY, {
        expiresIn: "3h",
      });
      res.json({ token: token });
    },
  );

  router.delete(
    `/users/:id(\\d+)`,
    validate(User),
    auth(null, User, "id"),
    function(req, res) {
      const user = res.locals.valid_object;
      user.deleteWithStripe(function(err, completed_msg) {
        if (!err) {
          res.status(200).json({ message: completed_msg });
          store.dispatchEvent(`users_deleted`, user);
        } else {
          res.status(400).json({ error: err });
        }
      });
    },
  );

  //Extend Entity
  require("./entity")(router, User, "users", "id");

  //Strip passwords from all user things
  router.all("*", function(req, res, next) {
    if (res.locals.json) {
      if (res.locals.json.password) {
        delete res.locals.json.password;
      } else if (Array.isArray(res.locals.json)) {
        res.locals.json = res.locals.json.map(user => {
          delete user.password;
          return user;
        });
      }
    }
    next();
  });

  return router;
};
