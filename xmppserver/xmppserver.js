/* jshint node: true */
"use strict";

var xmpp = require('node-xmpp-server');
var ltx = require('node-xmpp-core').ltx;


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

  // Setup
  this.config = options.config;
  this.db = undefined;
}


XmppServer.prototype.onStart = function (done) {
  var self = this;

  this.server = new xmpp.C2SServer({
      port: 5222,
      domain: 'localhost'
  });
  this.server.on("connect", this.onConnect);
  this.server.on("register", this.onRegister);
  return done();
};


XmppServer.prototype.onStop = function (done) {
  return done();
};


XmppServer.prototype.onRegister = function onRegister(opts, done) {
  var self = this;
  console.log('!****** onRegister', opts);
  done(true);
};


XmppServer.prototype.onConnect = function(client) {
  var self = this;

  client.on("authenticate", function(opts, cb) {
    console.log('!****** authenticate', opts);
    return cb(null, opts);
  });

  client.on("online", function() {
    console.log('!****** new client');
    // var msg = new ltx.Element('message', { to: 'localhost' }).c('body').t('HelloWorld');
    // client.send(msg);
  });

  // Stanza handling
  client.on("stanza", function(stanza) {
    console.log('stanza: ', stanza);
  });

  // On Disconnect event. When a client disconnects
  client.on("disconnect", function(client) {
    console.log('client disconnected');
  });

};


// exports
//
module.exports = XmppServer;
