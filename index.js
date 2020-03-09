"use strict";
const logger = require("./Middleware/logger");

var DAZN = require("./DAZN/src/server");
const port = 8080;

DAZN.app.listen(8080, function() {
  logger.info("DAZN is listening on port 8080!");
  console.log("DAZN is listening on port 8080!");
});
