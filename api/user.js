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
    id: {required: 0},
    username: {required: 1, defined: 1},
    password: {required: 1, defined: 1},
    email: {required: 1, defined: 1}
  };
  oap.check(req.body, template, function (err, args) {
    if (err) {
      return req.done(new Error('invalidArguments: '+util.inspect(err)));
    }

    async.auto({
      checkDupUsername: checkDupUsername,
      checkDupEmail: checkDupEmail,
      cryptPassword: cryptPassword,
      saveUser: ['checkDupUsername', 'checkDupEmail', 'cryptPassword', saveUser]
    }, onDone);

    function checkDupUsername(cb, results) {
      return cb();
    }
    function checkDupEmail(cb, results) {
      return cb();
    }
    function cryptPassword(cb, results) {
      _cryptPassword(args.password, cb);
    }
    function saveUser(cb, results) {
      var newUser = new self.User({
        id: args.id,
        username: args.username,
        password: results.cryptPassword,
        email: args.email,
        confirmed: null,  // todo
      });
      newUser.save().nodeify(cb);
      // send event.user.signup(id: newUserId)
    }
    function onDone(err, result) {
      if (err) return req.done(err);
      req.done(null, result.saveUser);
    }
  });
}



function getAuthToken(req) {
  var self = this;    // jshint ignore:line
  var template = {
    username: {required: 1, defined: 1},
    password: {required: 1, defined: 1},
  };

  // get username from db
  var args;
  async.waterfall([checkArgs, getUser, checkPassword, getToken], function (err, result) {
    return req.done(err, result);
  });

  function checkArgs(cb) {
    oap.check(req.body, template, cb);
  }
  function getUser(a, cb) {
    args = a;

    self.User.filter({username: args.username}).run().nodeify( function (err, users) {
      if (users.length === 0) {
        req.done(new Error('invalidUsernamePassword'));
        // send event.user.token.invalidUsername({username: username})
        return;
      }
      return cb(null, users[0]);
    });
  }
  function checkPassword(user, cb) {
    _checkPassword(args.password, user.password, function (err, same) {
      if (err) return cb(err);
      if (!same) {
        cb(new Error('invalidUsernamePassword'));
        // send event.user.token.invalidLogin({userId: user.id})
        return;
      }
      return cb(null, user);
    });
  }
  function getToken(user, cb) {
    if (user.authToken) {
      cb(null, {token: user.authToken});
      // send event.user.token.reuse({userId: userId})
      return;
    }

    // Update user with random authToken
    user.merge({authToken: uuid.v4()}).save().nodeify( function (err, user) {
      cb(null, {token: user.authToken});
      // send event.user.token.create({userId: userId})
      return;
    });
  }
}


/**
 * Gets users own details (from authToken)
 */
function getMe(req) {
  return req.done(null, req.user);
}


/**
 * Helper functions
 */
function _cryptPassword(password, done) {
  if (password.length < 6) {
    return done(new Error('chooseBetterPassword'));
  }
  var cryptedPassword = bcrypt.hash(password, 10, done);
}


function _checkPassword(password, crypted, done) {
  bcrypt.compare(password, crypted, done);
}


/**
 * Exports
 */
module.exports = {
  signUp: signUp,
  getAuthToken: getAuthToken,
  getMe: getMe
};
