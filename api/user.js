/* jshint node: true */
"use strict";
var util = require('util');

var async = require('neo-async');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var oap = require('oap');


/**
 * @alias userSignUp
 * @param  {m1cro.Request}
 * @param  {String} request.id          (id of user to create) [optional]
 * @param  {String} request.username
 * @param  {String} request.password
 * @param  {String} request.email
 * @return {User}                       The created user
 * @fires  event.user.signup.success(id: newUserId)
 * @todo checkDupUsername
 * @todo checkDupEmail
 */
function signUp(req) {
  var self = this;    // jshint ignore:line

  var template = {
    id: {required: 0},
    username: {required: 1, defined: 1},
    password: {required: 1, defined: 1},
    email: {required: 1, defined: 1},
    authToken: {required: 0}
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
      self.User.filter({username: args.username}).run().nodeify( function (err, users) {
        if (users.length) return cb(new Error('duplicateUsername'));
        return cb();
      });
    }
    function checkDupEmail(cb, results) {
      self.User.filter({email: args.email}).run().nodeify( function (err, users) {
        if (users.length) return cb(new Error('duplicateEmail'));
        return cb();
      });
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
        authToken: args.authToken,
        confirmed: null,  // todo
      });
      // send event.user.signup.success(id: newUserId)
      newUser.save().nodeify(cb);
    }
    function onDone(err, result) {
      if (err) return req.done(err);
      req.done(null, result.saveUser);
    }
  });
}


/**
 * @alias userGetAuthToken
 * Validates username / password and returns a authToken
 * @param  {m1cro.Request} req
 * @param  {String} req.username
 * @param  {String} req.password
 * @return {Object} {token: 'authToken'}
 */
function getAuthToken(req) {
  var self = this;    // jshint ignore:line
  var done = req.done.bind(req);

  var template = {
    username: {required: 1, defined: 1},
    password: {required: 1, defined: 1},
  };

  // get username from db
  var args;
  async.waterfall([checkArgs, getUser, checkPassword, getToken], done);

  function checkArgs(cb) {
    oap.check(req.body, template, cb);
  }
  function getUser(a, cb) {
    args = a;

    self.User.filter({username: args.username}).run().nodeify( function (err, users) {
      if (users.length === 0) {
        var errStr = 'invalidUsernamePassword';
        // send event
        return req.done(new Error(errStr));
      }
      return cb(null, users[0]);
    });
  }
  function checkPassword(user, cb) {
    _checkPassword(args.password, user.password, function (err, same) {
      if (err) return cb(err);
      if (!same) {
        // send event
        return cb(new Error('invalidUsernamePassword'));
      }
      return cb(null, user);
    });
  }
  function getToken(user, cb) {
    if (user.authToken) {
      // send event
      return cb(null, {token: user.authToken});
    }

    // Update user with random authToken
    var update = {
      authToken: uuid.v4()
    };
    user.merge(update).save().nodeify( function (err, user) {
      // send event
      return cb(null, {token: user.authToken});
    });
  }
}


/**
 * alias userGetMe
 * Retrieves users own information
 *     based on the users authToken
 * @return {User}
 */
function getMe(req) {
  return req.done(null, req.user);
}



function _cryptPassword(password, done) {
  if (password.length < 6) {
    return done(new Error('chooseBetterPassword'));
  }
  var cryptedPassword = bcrypt.hash(password, 10, done);
}


function _checkPassword(password, crypted, done) {
  bcrypt.compare(password, crypted, done);
}


// Exports
//
module.exports = {
  signUp: signUp,
  getAuthToken: getAuthToken,
  getMe: getMe
};
