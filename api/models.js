/* jshint node: true */
"use strict";


/**
 * User model
 */
function createUserModel(obj)  {
  obj.User = obj.db.createModel('user', {
    id: String,

    username: String,
    password: String,
    email: String,

    created: Date,
    confirmed: Date,
    deleted: Date,
    blocked: Date,

    authToken: String
  });

  obj.User.ensureIndex('username');
  obj.User.ensureIndex('email');
  obj.User.ensureIndex('authToken');
}


/**
 * Creates all the models
 */
function createModels(obj) {
  createUserModel(obj);

}


/**
 * Exports
 */
exports.createModels = createModels;
