const log4js = require("log4js");
let a = "b";
log4js.configure({
  appenders: {
    everything: {
      type: "file",
      filename: "./Middleware/StreamingApiLogs.log",
      maxLogSize: 10485760,
      backups: 3,
      compress: true
    }
  },
  categories: {
    default: { appenders: ["everything"], level: "debug" }
  }
});
const logger = log4js.getLogger("everything");

module.exports = logger;
