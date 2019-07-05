const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const knex = require("../config/db.js");
const File = require("./base/entity.js")("files");

File.findFile = function(filePath, id, callback) {
  const upload_path = path
    .normalize(`%${filePath}/${id}-%`)
    .split("\\")
    .join("\\\\");
  knex(File.table)
    .where("path", "like", upload_path)
    .orderBy("id", "desc")
    .then(function(result) {
      console.log(result);
      if (!result) {
        result = [];
      }
      const files = result.map(e => new File(e));
      callback(files);
    });
};

File.prototype.delete = function(callback) {
  const id = this.get("id");
  return knex(File.table)
    .where("id", id)
    .del()
    .catch(function(err) {
      console.error(err);
    });
};

module.exports = File;
