"use strict";

var DAZN = require("./DAZN/server");
const port = 8080;

DAZN.app.listen(8080, function() {
  console.log("DAZN is listening on port 8080!");
});
