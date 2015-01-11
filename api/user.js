/* jshint node: true */
"use strict";
var util = require('util');

var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var oap = require('oap');


/**
 * SignUp a new user
 */
function signUp(req) {
  var template = {
    username: {required: 1, defined: 1},
    password: {required: 1, defined: 1}
  };
  oap.check(template, req.data, function (err, args) {
    if (err) return new Error('invalidArguments: '+util.inspect(err));

    // check email for duplicates
    // crypt password
    // store in database
    // publish event {user.signup {id: user.id}}
    req.done(new Error('notImplementedYet'));
  });
}


function getAuthToken(req) {
  // get username from db
  // Check password
  // return existing token, or create new
  // update token on user record in db
  req.done(new Error('notImplementedYet'));
}



/**
 * Helper functions
 */
function _cryptPassword(password, done) {
  var cryptedPassword = bcrypt.hash(password, 10, function(err, hash) {
    return done(err, hash);
  });
}


function _checkPassword(password, crypted, done) {
  bcrypt.compare(password, crypted, function(err, same) {
   return done(err, same);
  });
}



/**
 * Exports
 */
exports = {
  signUp: signUp,
  getAuthToken: getAuthToken
};
