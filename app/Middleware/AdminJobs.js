"use strict";

class AdminJobs {
  async handle({ auth, response }, next) {
    const user = await auth.getUser();
    if (user.admin) {
      await next();
    } else {
        console.log("Not authorized")
      return response.status(401).json({ err: "User is not admin" });
    }
  }
}

module.exports = AdminJobs;
