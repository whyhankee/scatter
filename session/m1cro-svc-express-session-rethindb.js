/* jshint node: true */
"use strict";
var path = require('path');
var util = require('util');

var thinky = require('thinky');

/**
 * Our api service
 */
function M1croSession(iface, qname, options) {
  this.iface = iface;
  this.qname = qname;

  // Subscribe to messages
  iface.subscribe(this, qname+'.get', this.get);
  iface.subscribe(this, qname+'.set', this.set);

  // Make client available on the interface
  this.iface.client(qname, {api: ['get', 'set']});

  // Setup
  this.config = options.config;
  this.db = undefined;
}


M1croSession.prototype.onStart = function (done) {
  var self = this;

  // Connect to RethinkDB
  this.db = thinky({
    hostname: this.config.db.hostname,
    port: this.config.db.port,
    db: this.config.db.db
  });

  return done();
};


M1croSession.prototype.get = function get(req) {
  this.db.r.table('session').get(req.data.sid).run()
  .then( function (doc) {
      if (!doc) return req.done(null, undefined);
      return req.done(null, doc.session);
  })
  .error( function (err) {
      return req.done(err);
  });
};


M1croSession.prototype.set = function set(req) {
  var upsert = {id: req.data.sid, session: req.data.session};
  this.db.r.table('session').insert(upsert, {conflict: 'replace'}).run()
  .then(function() {
    return req.done(null);
  })
  .error( function (err) {
    return req.done(err);
  });
};


/**
 * exports
 */
module.exports = M1croSession;
