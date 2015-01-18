/* jshint node:true */
"use strict";
var util = require('util');

var express_session = require('express-session');


/**
 * This is the Express Session connector to a M1cro service
 *   it tells express to use our M1cro service to store session data
 *
 * usage:
 *
 *    var M1croSession = require(path.join(__dirname, 'm1cro-session'));
 *    ..
 *    var m1croSessionStore = new M1croSession.Store(iface, 'queueName');
 *    ..
 *    app.use(express_session({
 *      secret: 'our_very_big_secret',
 *      name: 'sid',
 *      cookie: cookieOptions,
 *      store: m1croSessionStore
 *    }));
 *
 */


function M1croSession(iface, qname) {
  this.iface = iface;
  this.qname = qname;
}
util.inherits(M1croSession, express_session.Store);


M1croSession.prototype.get = function get(sid, cb) {
  this.iface.clients[this.qname].publish('get', {sid: sid}, cb);
};


M1croSession.prototype.set = function set(sid, session, cb) {
  this.iface.clients[this.qname].publish('set', {sid: sid, session: session}, cb);
};


M1croSession.prototype.destroy = function destroy(sid, session, cb) {
  this.iface.clients[this.qname].publish('destroy', {sid: sid, session: session}, cb);
};


/**
 * Exports
 */
exports.Store = M1croSession;
