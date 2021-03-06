/* jshint node: true */
"use strict";
var path = require('path');

var thinky = require('thinky');

var model = require(path.join(__dirname,'models'));
var user = require(path.join(__dirname,'user'));
var contact = require(path.join(__dirname,'contact'));



// Middleware
//
// checks if the authToken or authUser is valid
//      authToken: secure token of 'from' user
//      authToken: userName of 'from' user - format: a@b.c/deviceid
//    if successful, loads the user object on the request (req.user)
//    if !succesful, returns err
//
var checkAuthToken =  {
  pre: function(req) {
    var self = this;

    var userFilter;
    if (req.body.authToken) {
        userFilter = {authToken: req.body.authToken};
    } else if (req.body.authUser) {
        var userName = req.body.authUser.replace(/\/.*/, '');
        userFilter = {username: userName};
    } else {
        return req.done(new Error('notAuthorized'));
    }

    // Load User based on authToken
    self.User.filter(userFilter).run( function (err, users) {
      if (users.length !== 1)  return req.done(new Error('notAuthorized'));

      self.iface.log.debug('Loaded authenticated user', {
        authToken: req.body.authToken,
        userid: users[0].id
      });
      req.user = users[0];
      return req.next();
    });
  }
};



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
  iface.subscribe(this, qname+'.contactAdd', [checkAuthToken, this.contactAdd]);
  iface.subscribe(this, qname+'.contactList', [checkAuthToken, this.contactList]);
  iface.subscribe(this, qname+'.contactDelete', [checkAuthToken, this.contactDelete]);

  // Register our client to the api on the interface
  iface.client('scatter_api', {api: [
    'userSignUp', 'userGetAuthToken', 'userGetMe',
    'contactAdd', 'contactList', 'contactDelete'
    ]
  });

  // Setup
  this.config = options.config;
  this.db = undefined;
}


ApiService.prototype.onStart = function (done) {
  // Connect to RethinkDB
  this.db = thinky({
    hostname: this.config.db.hostname,
    port: this.config.db.port,
    db: this.config.db.db
  });

  // create the models
  model.createModels(this);
  return done();
};


ApiService.prototype.onStop = function (done) {
  return done();
};



// User methods
ApiService.prototype.userSignUp = user.signUp;
ApiService.prototype.userGetAuthToken = user.getAuthToken;
ApiService.prototype.userGetMe = user.getMe;

// Contact methods
ApiService.prototype.contactAdd = contact.add;
ApiService.prototype.contactList = contact.list;
ApiService.prototype.contactDelete = contact.delete;


// exports
//
module.exports = ApiService;
