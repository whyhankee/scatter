/* jshint node: true */
"use strict";
var path = require('path');
var util = require('util');

var thinky = require('thinky');

var model = require(path.join(__dirname,'models'));
var user = require(path.join(__dirname,'user.js'));



/**
 * The main ApiService
 * @class
 * @param {m1cro.Interface} iface     The m1cro interface this service is connected to
 * @param {String} qname              Name of the queue to listen to
 * @param {Object} options Options
 * @param {Object} options.config
 *
 */
function ApiService(iface, qname, options) {
  this.iface = iface;
  this.qname = qname;

  // Subscribe to messages
  iface.subscribe(this, qname+'.userSignUp', this.userSignUp);
  iface.subscribe(this, qname+'.userGetAuthToken', this.userGetAuthToken);
  iface.subscribe(this, qname+'.userGetMe', [checkAuthToken, this.userGetMe]);

  // Register our client to the api on the interface
  iface.client('mist_api', {api: [
    'userSignUp', 'userGetAuthToken', 'userGetMe']
  });

  // Setup
  this.config = options.config;
  this.db = undefined;
}


ApiService.prototype.onStart = function (done) {
  var self = this;

  // Connect to RethinkDB
  this.db = thinky({
    hostname: this.config.db.hostname,
    port: this.config.db.port,
    db: this.config.db.db
  });

  // create the models
  var models = model.createModels(this);
  return done();
};


ApiService.prototype.onStop = function (done) {
  return done();
};


// checks if the authToken is valid
//    if successful, loads the user object on the request (req.user)
var checkAuthToken =  {
  pre: function(req) {
    var self = this;

    if (!req.body.authToken) return req.done(new Error('notAuthorized'));

    // Load User based on authToken
    self.User.filter({authToken: req.body.authToken}).run( function (err, users) {
      if (users.length === 0)  return req.done(new Error('notAuthorized'));
      if (users.length > 1)  return req.done(new Error('notAuthorized'));

      self.iface.log.debug('Loaded authenticated user', {
        authToken: req.body.authToken,
        userid: users[0].id
      });
      req.user = users[0];
      return req.next();
    });
  }
};




// User methods
//
ApiService.prototype.userSignUp = user.signUp;
ApiService.prototype.userGetAuthToken = user.getAuthToken;
ApiService.prototype.userGetMe = user.getMe;


// exports
//
module.exports = ApiService;
