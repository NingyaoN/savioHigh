const User = use("App/Models/User");
const Drive = use("Drive");
const moment = use("moment");


class DashboardController{
  async dashboard({request, response, view}) {
    console.log("hit me")
    return view.render("dashboard.fullDashboard")
  }
 }
module.exports =  DashboardController;