"use strict";

const BaseModel = use("MongooseModel");
const Schema = require("mongoose").Schema;
/**
 * @class User
 */
class Todo extends BaseModel {
    static boot() {
            // this.addHook("preSave", "UserHook.hashPassword");
        }
        /**
         * User's schema
         */
    static get schema() {
        return {
           user_details: {
               type: Schema.Types.Mixed,
               required: true,
           },
           todo_info: {
               type: Schema.Types.Mixed,
               required: true
           }

        };
    }
}

module.exports = Todo.buildModel("Todo");