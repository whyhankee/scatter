/* jshint node: true */
"use strict";
var util = require('util');

var async = require('async');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var oap = require('oap');


/**
 * SignUp a new user
 */
function signUp(req) {
  var self = this;    // jshint ignore:line

  var template = {
    username: {required: 1, defined: 1},
    password: {required: 1, defined: 1},
    email: {required: 1, defined: 1}
  };
  oap.check(req.data, template, function (err, args) {
    if (err) {
      return req.done(new Error('invalidArguments: '+util.inspect(err)));
    }

    async.auto({
      checkDupEmail: checkDupEmail,
      cryptPassword: cryptPassword,
      saveUser: ['checkDupEmail', 'cryptPassword', saveUser],
      sendEvent: ['saveUser', sendEvent]
    }, onDone);

    function checkDupEmail(cb, results) {
      return cb();
    }
    function cryptPassword(cb, results) {
      _cryptPassword(args.password, cb);
    }
    function saveUser(cb, results) {
      var newUser = new self.User({
        username: args.username,
        password: results.cryptPassword,
        email: args.email
      });
      newUser.save().nodeify(cb);
    }
    function sendEvent(cb) {
      // send event.user.signup(id: newUserId)
      return cb();
    }

    function onDone(err, result) {
      if (err) return req.done(err);
      req.done(null, result.saveUser);
    }
  });
}




function getAuthToken(req) {
  var self = this;    // jshint ignore:line

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
  if (password.length < 6) {
    return done(new Error('chooseBetterPassword'));
  }

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
module.exports = {
  signUp: signUp,
  getAuthToken: getAuthToken
};
