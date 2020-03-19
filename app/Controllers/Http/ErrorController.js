"use strict";
const logger = use("shs2010/logger");

class ErrorController {
  async handleunauthorized({ request, view, auth }) {
    logger.log(
      request,
      "error",
      "ErrorController.handleunauthorized",
      auth.user
    );
   // return view.render("displays.unsorted.unauthorized");
  }
}

module.exports = ErrorController;
