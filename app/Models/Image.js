'use strict'

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
const mongoose = use("Adonis/Addons/Mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

/**
 * @class Video
 */
class Image extends BaseModel {
  static boot({ schema }) {
  }
  /**
   * Video's schema
   */
  static get schema () {
    return {
      
      title: {
        type: String,
      },
      photo_id: {
        type: Schema.Types.Mixed,
      },
      year: {
        type: String,
        required: true,
      },
      user_details: {
        type: Schema.Types.Mixed,
      },
      like: {
        type: Schema.Types.Mixed,
      },
      comments: {
        type: Schema.Types.Mixed,
      }
    }
  }
}

module.exports = Image.buildModel('Image')
