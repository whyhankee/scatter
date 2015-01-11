/* jshint node: true */
"use strict";
var path = require('path');

var thinky = require('thinky');

var model = require(path.join(__dirname,'/models'));
var user = require(path.join(__dirname,'/user'));


/**
 * Our api service
 */
function ApiService(iface, qname, options) {
  iface.subscribe(qname+'.userGetAuthToken', this.userGetAuthToken);

  this.config = options.config;
  this.db = undefined;
  this.m = {};
}


ApiService.prototype.onStart = function(done) {
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


ApiService.prototype.userSignup = user.signup;
ApiService.prototype.userGetAuthToken = user.getAuthToken;


/**
 * exports
 */
module.exports = ApiService;
