const morgan = require("morgan");
const os = require("os");
const config = require("../config/config");

morgan.token("hostname", function getHostname() {
  return os.hostname();
});
morgan.token("pid", function getPid() {
  return process.pid;
});

// construct log entry
function jsonFormat(tokens, req, res) {
  return JSON.stringify({
    "remote-address": tokens["remote-addr"](req, res),
    time: tokens["date"](req, res, "iso"),
    method: tokens["method"](req, res),
    url: tokens["url"](req, res),
    "http-version": tokens["http-version"](req, res),
    "status-code": tokens["status"](req, res),
    "content-length": tokens["res"](req, res, "content-length"),
    referrer: tokens["referrer"](req, res),
    "user-agent": tokens["user-agent"](req, res),
    hostname: tokens["hostname"](req, res),
    pid: tokens["pid"](req, res),
  });
}

// logger for test and development modes
const loggerMiddlerware = function logger() {
  return morgan(jsonFormat);
};

// use no logger for any other modes (prod)
const skippedLogger = () => (req, res, next) => next();

module.exports = config.env !== "test" ? loggerMiddlerware : skippedLogger;
