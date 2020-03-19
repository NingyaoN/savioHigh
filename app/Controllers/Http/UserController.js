"use strict";

const User = use("App/Models/User");
const { validateAll } = use("Validator");
const _ = require("lodash");
const Hash = use("Hash");
const uuid = use("uuid/v4");
const Env = use("Env");
const crypto = use("crypto");
const logger = use("shs2010/logger");
const phone = use("phone");
const nodemailer = require("nodemailer");
const moment = use("moment");

class UserController {
    // registerUser({ request, view, auth }) {
    //     logger.log(request, "debug", "User.create", auth.user);
    //     return view.render("displays.user.register");
    // }

    // postTest({ request, view, auth }) {
    //     logger.log(request, "debug", "User.postTest", auth.user);
    //     return view.render("screens.unsorted.test");
    // }
    async index({ request, response, auth }) {
        logger.log(request, "debug", "User.index", auth.user);
        let users = await User.find({});
        return response.json(users);
    }

    async search({ response, request, auth }) {
        let query = request.only(["email", "number", "name"]);
        logger.log(request, "info", "User.search", auth.user, null, { query });
        if (_.isEmpty(query)) {
            return response.json({});
        }
        const mongoquery = {};
        Object.keys(query).forEach(key => {
            const str = `^${query[key]}`;
            mongoquery[key] = { $regex: new RegExp(str), $options: "i" };
        });
        let users = await User.find(mongoquery);
        return response.json(users);
    }

    async show({ request, params, response, auth }) {
        logger.log(request, "debug", "User.show", auth.user, null, params);
        const user = await User.find(params.id);
        delete user.password;
        return response.json(user);
    }

    async me({ request, auth, response, view }) {
        logger.log(request, "debug", "User.me", auth.user);
        const user = await auth.getUser();
        delete user.password;
        return response.json(user);
    }

    async checkEmail({ response, request, auth, }) {
        console.log("hit")
        const { email } = await request.only(["email"]);
        console.log("email", email)
        const user = await User.findOne({ email });
        if (user)
            return response.status(409).json({ msg: "Email Already exist." });

        return response.status(200).json({ msg: "Success" });
    }
    async storeUser({ session, request, response, auth, view }) {
        const data = request.only([
            "name",
            "email",
            "password",
            "password_confirmation",

        ]);
        logger.log(request, "info", "User.store", auth.user, null, { data });

        const validation = await validateAll(data, {
            email: "required|email",
            password: "required",
        });
        if (validation.fails()) {
            session.withErrors(validation.messages()).flashExcept(["password"]);

            return response.json({ err: validation.messages() });
        }
        console.log(data)
        delete data.password_confirmation;
        data.password = await Hash.make(data.password);
        const user = await User.create(data);
        delete user.password;
        return response.status(200).json(user);
    }
    async resetPassword({ view }) {
        return view.render("displays.user.reset");
    }
    async checkEmail({ request, response }) {
        const email = request.params.email;
        console.log(email)
        const user = await User.findOne({ email });
        if (!user) {
            return response.status(500).json({
                err: [
                    { message: "User does not exist." }
                ]
            })
        }
        return response.status(200).json({
            user
        })
    }
    async updatePassword({ request, response, params, session }) {
            const data = await request.only(["email", "password"]);
            logger.log(request, "info", "User.updatePassword", null, null, { data });
            const rules = {
                email: "required|email",
                password: "required",
            }
            const messages = {
                "email": "Email is required"
            }
            const validation = await validateAll(data, rules, messages);
            if (validation.fails()) {
                session.withErrors(validation.messages()).flashExcept(["password"]);
                return response.json({ err: validation.messages() });
            }
            const user = await User.findOne({ email: request.params.email });
            data.password = await Hash.make(data.password);
            user.password = data.password;
            await user.save();
            delete user.password;
            return response.redirect("/shs/user/request");
        }
        // TODO -fix password storage
    async update({ params, request, response, auth }) {
        const userInfo = request.only(["email", "password"]);
        logger.log(request, "info", "User.update", auth.user, null, {
            params,
            userInfo
        });

        const user = await User.findOne({ _id: params.id });
        if (!user) {
            return response.status(404).json({ data: "User not found" });
        }
        user.email = userInfo.email;
        user.password = userInfo.password;
        await user.save();
        delete user.password;
        return response.status(200).json(user);
    }

    async delete({ request, params, response, auth }) {
        logger.log(request, "info", "User.delete", auth.user, null, params);
        const user = await User.findOneAndRemove(params.id);
        if (!user) {
            return response.status(404).json({ data: "User not found" });
        }
        return response.status(204).json(null);
    }
    async userprofile({ request, auth, view }) {
        logger.log(request, "debug", "User.delete", auth.user);
        const userDetail = await auth.getUser();
        return view.render("screens.unsorted.viewWorkerProfile", { userDetail });
    }
    async premiumPage({ view }) {
        const questions = await Premium.find();

        const clonequestion = JSON.parse(JSON.stringify(questions));
        await clonequestion.map(q => {
            let str = q.message.substr(0, 20);
            q.short = `${str}...`;
            return q;
        })
        console.log(clonequestion)
        return view.render("displays.transaction.premium", { clonequestion });
    }
    async paymentPage({ view }) {
        const OID = `ORDER${uuid()}TKLMOVIE`;
        console.log(OID)
        return view.render("displays.transaction.payment", { OID });
    }
    async pay({ request, response, auth }) {
        const user = await auth.getUser();
        const data = await request.all();
        const key = Env.get("TESTPAYUKEY");
        const salt = Env.get("TESTPAYUSALT");
        data.key = key;
        data.salt = salt;
        var cryp = crypto.createHash('sha512');
        var text = data.key + '|' + data.txnid + '|' + data.amount + '|' + data.pinfo + '|' + data.fname + '|' + data.email + '|||||' + data.udf5 + '||||||' + data.salt;
        cryp.update(text);
        var hash = cryp.digest('hex');
        // response.setHeader("Content-Type", "text/json");
        // response.setHeader("Access-Control-Allow-Origin", "*");
        // response.end(JSON.stringify(hash));		
        return response.status(200).json({ hash, key, salt })
    }
    async failure({ view }) {
        return view.render("displays.transaction.paymentError");
    }
    async success({ request, response }) {
        const data = await request.all();
        return response.status(200).json({
            data
        })
    }
    async successRender({ request, view }) {
        const data = await request.all();
        return view.render("displays.transaction.success");
    }


}

module.exports = UserController;