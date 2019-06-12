const multer = require("multer");
const mkdirp = require("mkdirp");
const path = require("path");
const auth = require("../middleware/auth");
const SystemOption = require("../models/system-options");
const EventLogs = require("../models/event-log");
const validate = require("../middleware/validate");
const File = require("../models/file");

const systemFilePath = "uploads/system-options";
const appPackage = require("../package.json");
const store = require("../config/redux/store");

const fileManager = store.getState(true).pluginbot.services.fileManager[0];
const systemFiles = ["front_page_image", "brand_logo", "loader_logo"];
const uploadLimit = function() {
  return store.getState().options.upload_limit * 1000000;
};

const upload = () => {
  return multer({
    storage: fileManager.storage(systemFilePath),
    limits: { fileSize: uploadLimit() },
  });
};

module.exports = function(router) {
  router.get(`/system-options/file/:id`, function(req, res, next) {
    if (systemFiles.indexOf(req.params.id) > -1) {
      File.findFile(systemFilePath, req.params.id, function(image) {
        if (image.length > 0) {
          const file = image[0];
          fileManager.sendFile(file, res);
        } else {
          // todo: make less hardcoded.. maybe seperate api calls again
          if (req.params.id == "brand_logo") {
            return res.sendFile(
              path.resolve(
                __dirname,
                "../public/assets/logos/v1/servicebot-logo-full-white.png",
              ),
            );
          }
          if (req.params.id == "loader_logo") {
            return res.sendFile(
              path.resolve(
                __dirname,
                "../public/assets/logos/v1/servicebot-logo-full-blue.png",
              ),
            );
          }
          res.status(400).send("no image");
        }
      });
    } else {
      res.status(400).send("not a valid system file option");
    }
  });

  router.put(
    "/system-options/file/:id",
    auth(),
    upload().single("file"),
    function(req, res, next) {
      if (systemFiles.indexOf(req.params.id) > -1) {
        const { file } = req;
        file.name = file.originalname;
        file.user_id = req.user.get("id");
        File.findFile(systemFilePath, req.params.id, function(brandLogo) {
          if (brandLogo.length > 0) {
            const logoToDelete = brandLogo[0];
            fileManager.deleteFile(logoToDelete);
          }
          const icon = new File(file);
          icon.create(function(err, result) {
            result.message = "File Uploaded";
            EventLogs.logEvent(
              req.user.get("id"),
              `system-options ${
                req.params.id
              } was updated by user ${req.user.get("email")}`,
            );
            res.json(result);
          });
        });
      } else {
        res.status(400).send("not a valid system file option");
      }
    },
  );

  router.get(`/system-options/version`, auth(), function(req, res, next) {
    res.status(200).send({ version: appPackage.version });
  });

  return router;
};
