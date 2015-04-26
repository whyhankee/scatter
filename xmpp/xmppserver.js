/* jshint node: true */
"use strict";
var util = require('util');

var xmpp = require('node-xmpp-server');
// var ltx = require('node-xmpp-core').ltx;
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
  this.server = new xmpp.C2SServer({
      port: 5222,
      domain: 'localhost'
  });

  this.server.on("connect", function(client) {
    debug('xmppServer connect');

    // Get clients
    self.apiClient = self.iface.clients.scatter_api;

    // Client methods
    client.on("authenticate", function(opts, cb) {
      var userEmail = util.format('%s@%s', opts.username, opts.jid.domain);
      debug('xmppServer authenticating', userEmail);
      self.apiClient.userGetMe({authToken: opts.password}, function (err) {
        if (err) {
          debug('authenticate failed', {user: userEmail});
          return cb(false);
        }
        return cb(null, opts);
      });
    });

    client.on("online", function() {
      debug('new xmpp client');
      // var msg = new ltx.Element('message', { to: 'localhost' }).c('body').t('HelloWorld');
      // client.send(msg);
    });

    // Stanza handling
    client.on("stanza", function(stanza) {
      debug('stanza: ' + stanza.name);
      console.log('!****** stanza', stanza);
    });

    // On Disconnect event. When a client disconnects
    client.on("disconnect", function(/*client*/) {
      debug('client disconnected');
    });

  });

  this.server.on("register", function onRegister(opts, done) {
    debug('!****** onRegister', opts);
    return done(true);
  });

  return done();
};


XmppServer.prototype.onStop = function (done) {
  return done();
};



// exports
//
module.exports = XmppServer;
