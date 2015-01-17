/* jshint node: true */
"use strict";
var path = require('path');
var util = require('util');

var thinky = require('thinky');

var model = require(path.join(__dirname,'/models'));
var user = require(path.join(__dirname,'/user.js'));


var apiLogger = {
  pre: function timerStart(req) {
    req.s.timerStart = Date.now();
    return req.next();
  },

  post: function timerStop(req) {
    console.log(util.format('API %s %s %d ms',
      req.message,
      req.response.err === null ? "Ok" : "Error",
      Date.now()-req.s.timerStart)
    );
    return req.next();
  }
};


/**
 * Our api service
 */
function ApiService(iface, qname, options) {
  // Service wide middleware
  iface.serviceUse(qname, apiLogger);

  // Subscribe to messages
  iface.subscribe(this, qname+'.userSignUp', this.userSignUp);
  iface.subscribe(this, qname+'.userGetAuthToken', this.userGetAuthToken);

  // Setup
  this.config = options.config;
  this.db = undefined;
  this.m = {};
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
  console.log('Mist Api service started');
  return done();
};

ApiService.prototype.onStop = function (done) {
  return done();
};


ApiService.prototype.userSignUp = user.signUp;
ApiService.prototype.userGetAuthToken = user.getAuthToken;


/**
 * exports
 */
module.exports = ApiService;
