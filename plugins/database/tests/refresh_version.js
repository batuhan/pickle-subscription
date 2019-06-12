const path = require("path");
require("dotenv").config({
  path: require("path").join(__dirname, "../../../env/.env"),
});

const knex = require("../../../config/db");

// require("../migrations/versions/0.9.0").down(knex);
require("../migrations/versions/0.9.0").up(knex);
