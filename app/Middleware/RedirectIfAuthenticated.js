"use strict";

class RedirectIfAuthenticated {
    async handle({ auth, request, response }, next) {
        try {
            const user = await auth.getUser();
            await auth.check();
            return response.redirect(`/shs/@${user.name}`);
        } catch (e) {}
        await next();
    }
}
module.exports = RedirectIfAuthenticated;