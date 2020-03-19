"use strict";

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
/**
 * @class User
 */
class Bugreport extends BaseModel {

    /**
     * User's schema
     */
    static get schema() {
        return {
            route: {
                type: String
                // unique: true,
            },
            reason: {
                type: String,
                required: true
            },
            date: {
                type: String,
            },
            reporter: {
                type: Schema.Types.Mixed
            }
        };
    }
}
module.exports = Bugreport.buildModel("Bugreport");
