"use strict";

class UserCheck {
  async handle({ request, auth, response }, next) {
    const user = await auth.getUser();
    if (user.admin) {
        if(request.url == "/shs") {
            response.redirect(`/shs/${user.name}`);
            await next();
        }
     
    } else {
       await next();
    }
  }
}

module.exports = UserCheck;
