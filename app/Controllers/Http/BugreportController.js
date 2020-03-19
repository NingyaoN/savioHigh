const Bugreport = use("App/Models/Bugreport");
const moment = use("moment");

class BugreportController {
    async bugReport({ view }) {
        return view.render("displays.bugreport.bugReport");
    }   

    async storeReport({ request, response, auth }) {
        const data = await request.only(["reason", "route"]);
        const user = await auth.getUser();
        const payload = {
            reason: data.reason,
            route: data.route,
            reporter: {
                name: user.name,
                email: user.email,
                user_id: user._id,
            },
            date: moment().format("DD-MM-YYYY")
        }
        
        const report = await Bugreport.create(payload);
        return response.status(200).json(report);
    }

    async bugs({ response, request, view, auth }) {
        const user = await auth.getUser();
        if(!user.admin) return response.status(500).json({msg: "User is not admin."});
        const bugs = await Bugreport.find();
        console.log("bugs", bugs)
        if(!bugs) return response.status(500).json({msg: "Bugs not found"});
        console.log(bugs)
        return view.render("displays.bugreport.bugs", {bugs});
    }   
}

module.exports = BugreportController;