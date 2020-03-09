"use strict";
const logger = require("./Middleware/logger");

var DAZN = require("./DAZN/src/server");
const port = process.env.port;

DAZN.app.listen(port, function() {
  logger.info(`DAZN is listening on port ${port}!`);
  console.log(`DAZN is listening on port ${port}!`);
});
