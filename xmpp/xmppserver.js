/* jshint node: true */
"use strict";
var util = require('util');

var xmpp = require('node-xmpp-server');
var ltx = require('node-xmpp-core').ltx;
var debug = require('debug')('scatter:xmppServer');


/**
 * The main xmppServer
 * @class
 * @param {m1cro.Interface} iface     The m1cro interface this service is connected to
 * @param {String} qname              Name of the queue to listen to
 * @param {Object} options            Options
 * @param {Object} options.config     The configuration
 */
function XmppServer(iface, qname, options) {
  this.iface = iface;
  this.qname = qname;

  // The server
  this.server = null;
  this.apiClient = null;

  // Setup
  this.config = options.config;
}


XmppServer.prototype.onStart = function (done) {
  var self = this;

  // Start XMPP server
  this.server = new xmpp.WebSocketServer({
    port: 5280,
    domain: 'localhost'
  });

  // Connect existing client
  this.server.on("connect", function(client) {
    debug('xmppServer connect');

    // Get clients
    self.apiClient = self.iface.clients.scatter_api;

    client.on('register', function onRegister(opts, done) {
      debug('xmppServer registering', opts);

      var signupInfo = {
        username: opts.username + '@' + opts.client.serverdomain,
        password: opts.password
      };
      self.iface.clients.scatter_api.userSignUp(signupInfo, function (err) {
        if (err) {
          debug('xmppServer register user failed', {error: err, opts: opts});
          return done(false);
        }
        debug('xmppServer register user succesful', opts);
        return done(true);
      });
    });

    // Client methods
    client.on("authenticate", function(opts, cb) {
      var userEmail = util.format('%s@%s', opts.username, opts.jid.domain);
      debug('xmppServer authenticating', userEmail);

      var authInfo = {
        username: opts.username + '@' + opts.client.serverdomain,
        password: opts.password
      };

      // self.apiClient.userGetMe({authToken: opts.password}, function (err) {
      self.apiClient.userGetAuthToken(authInfo, function (err) {
        if (err) {
          debug('authenticate failed', {user: userEmail});
          return cb(false);
        }
        debug('authenticate succes', {user: userEmail});
        return cb(null, opts);
      });
    });

    client.on("online", function() {
      debug('xmpp client online');

      var to = client.jid.local +'@'+ client.jid.domain;
      var msg = new ltx.Element('message', {to: to}).c('body').t('Welcome to scatter');
      client.send(msg);
    });

    // Stanza handling
    client.on("stanza", function(stanza) {
      console.log('!****** server stanza', stanza);
    });

    // On Disconnect event. When a client disconnects
    client.on("disconnect", function(/*client*/) {
      debug('client disconnected');
    });

  });

  return done(null);
};


XmppServer.prototype.onStop = function (done) {
  return done();
};



// exports
//
module.exports = XmppServer;
