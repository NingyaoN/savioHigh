const Newsletter = use("App/Models/Newsletter");
const User = use("App/Models/User");
const moment = use("moment");

class Newsletters {
    async send({ request, response, auth }) {
        console.log("HIT")
        const { to, msg, userID } = await request.only(["to", "msg", "userID"]);
        const sender = await auth.getUser();
        const receiver = await User.findOne({email: to});

        if(!receiver) return response.status(500).json({msg: "Receiver does not exist."});
        let payload = {
          sender,  
          receiver,
          msg
        }
        const newsletter = await Newsletter.create(payload);
        return response.status(200).json(newsletter);
    }
}

module.exports = Newsletters;