"use strict";

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
/**
 * @class User
 */
class User extends BaseModel {
    static boot() {
            // this.addHook("preSave", "UserHook.hashPassword");
        }
        /**
         * User's schema
         */
    static get schema() {
        return {
            name: {
                type: String,
                required: true,
                // unique: true,
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            password: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                // unique: true,
            },
            admin: {
                type: Boolean,
                //required: true,
            },
            avatar: {
                type: String,
            },
            bio: {
                type: String,
            }
        };
    }
}

module.exports = User.buildModel("User");