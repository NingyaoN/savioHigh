"use strict";

class Admin {
  async handle({ auth, response }, next) {
    const user = await auth.getUser();
    if (user.type === "admin") {
      await next();
    } else {
      return response.status(401).json({ err: "User is not admin" });
    }
  }
}

module.exports = Admin;
