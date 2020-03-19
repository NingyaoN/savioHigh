"use strict";

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
/**
 * @class User
 */
class Blog extends BaseModel {
    static boot() {
            // this.addHook("preSave", "UserHook.hashPassword");
        }
        /**
         * User's schema
         */
    static get schema() {
        return {
            user_blog: {
                type: Schema.Types.Mixed
            },
            user_details: {
                type: Schema.Types.Mixed
            }
        };
    }
}

module.exports = Blog.buildModel("Blog");