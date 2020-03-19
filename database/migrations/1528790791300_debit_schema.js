"use strict";
// debitor
const Schema = use("Schema");

class DebitSchema extends Schema {
  up() {
    this.create("debits", table => {
      table.increments();
      table.timestamps();
      table.string("amount");
      table.integer("debitor");
      table.integer("entry_by");
      table.string("reason");
    });
  }

  down() {
    this.drop("debits");
  }
}

module.exports = DebitSchema;
