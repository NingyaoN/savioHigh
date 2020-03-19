const winston = require("winston");
var { Loggly } = require("winston-loggly-bulk");

class Winston {
  constructor(Config) {
    const logInstance = new Loggly({
      token: "0f9b0922-8687-46e4-9a49-c0d2e1f9d1b6",
      subdomain: "tklmovie",
      tags: ["Winston-NodeJS"],
      json: true
    });

    winston.add(logInstance);
  }
  log(request, level, controller, user, error, meta) {
    if (level === "error") {
      winston.log(level, {
        hostname: request.hostname(),
        time: Date.now(),
        url: request.url(),
        controller,
        body: request.raw(),
        headers: request.headers(),
        ip: request.ip(),
        meta,
        error: (error && error.stack) || "",
        uid: (user && String(user._id)) || ""
      });
    } else {
      winston.log(level, {
        hostname: request.hostname(),
        time: Date.now(),
        url: request.url(),
        controller,
        body: request.raw(),
        ip: request.ip(),
        meta,
        error: (error && error.stack) || "",
        uid: (user && String(user._id)) || ""
      });
    }
  }
  clog(request, level, controller, user, body, error, meta) {
    winston.log(level, {
      hostname: request.hostname(),
      time: Date.now(),
      url: request.url(),
      controller,
      body,
      headers: request.headers(),
      ip: request.ip(),
      meta,
      error: (error && error.stack) || "",
      uid: (user && String(user._id)) || ""
    });
  }
}

module.exports = Winston;
