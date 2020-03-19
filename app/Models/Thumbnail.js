'use strict'

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
const mongoose = use("Adonis/Addons/Mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

/**
 * @class Video
 */
class Thumbnail extends BaseModel {
 
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
      tag : {
          type: String,
          required: true,
      },
      year: {
          type: String,
          required: true,
      }
    }
  }
}

module.exports = Thumbnail.buildModel('Thumbnail')
