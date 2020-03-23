'use strict'

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
const mongoose = use("Adonis/Addons/Mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

/**
 * @class Video
 */
class Newsletter extends BaseModel {
  static get schema () {
    return {
     sender: {
       type: Schema.Types.Mixed,
     },
     receiver: {
      type: Schema.Types.Mixed,
     },
     msg: {
       type: String,
     },
    }
  }
}

module.exports = Newsletter.buildModel('Newsletter')
