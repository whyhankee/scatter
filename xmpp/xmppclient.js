"use strict";

var xmpp = require('node-xmpp-client');
var ltx = require('node-xmpp-core').ltx;
var debug = require('debug')('scatter:xmppClient');


function XmppClient(jid, io) {
  var self = this;

  self.jid = jid;
  self.io = io;

  self.cl = new xmpp.Client({
    jid: jid.username,
    password: jid.password
  });

  debug('connecting '+self.jid.username);
  self.cl.on('online', function() {
    debug('online '+self.jid.username);
    // var msg = new ltx.Element('message', {to: 'localhost' }).
    //   c('body').
    //   t('HelloWorld');
    // self.cl.send(msg);
  });

  self.cl.on('stanza', function(stanza) {
    debug('stanza '+self.jid.username, stanza.name);
  });

  self.cl.on('error', function(e) {
    console.error(e);
  });
}


XmppClient.prototype.contactAdd = function(username) {
  var self = this;

  var presenceSubscrite =new ltx.Element('presence', {
    to: username,
    from: self.jid.username,
    type: 'subscribe'
  });
  self.cl.send(presenceSubscrite);
};


// Exports
//
module.exports = XmppClient;
