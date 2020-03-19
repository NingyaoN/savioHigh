const Winston = require("../Utility/Winston");
const { ioc } = require("@adonisjs/fold");

ioc.singleton("shs2010/logger", function() {
  return new Winston();
});
