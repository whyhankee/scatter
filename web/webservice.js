/* jshint node: true */
"use strict";
var path = require('path');
var os = require('os');
var util = require('util');

var express = require('express.io');
var morgan = require('morgan');
var debug = require('debug')('scatter:web');


var _baseDir = __dirname;
var XmppClient = require(path.join(_baseDir, '..', 'xmpp', 'xmppclient'));


// Are we running production?
var isProduction = process.env.NODE_ENV.match(/^prod/);


// Our WebServer service
//
function WebService(iface, qname, options) {
  this.iface = iface;
  this.qname = qname;

  // Setup Express instance and configure
  this.app = express();
  this.app.http().io();

  this.app.all('*', function(req, res, next){
    if (!req.get('Origin')) return next();
    // use "*" here to accept any origin
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
     // res.set('Access-Control-Allow-Max-Age', 3600);
    if ('OPTIONS' === req.method) return res.send(200);
    next();
  });

  this.app.set('iface', iface);
  this.app.set('config', options.config);



  // Middlware for WebServer *AND* ApiServer
  this.app.use(morgan(isProduction ? 'combined' : 'dev'));
  this.app.use(function(req, res, next) {
    req.api = req.app.get('iface').clients.scatter_api;
    return next();
  });

  // Setup components
  this.setupWebServer(iface);
  this.setupSocketServer(iface);

  // .. errorHandler last
  this.app.use(errorHandler);
}


WebService.prototype.onStart = function(done) {
  var self = this;
  var config = self.app.get('config');

  // Start Express server
  this.app.listen(config.server.port, function (err) {
    if (err) return done(err);

    self.iface.log.info(util.format(
      self.iface.appName + ' webservice started at http://%s:%d/',
      os.hostname(), config.server.port
    ));
    return done();
  });

};



// Setup Webserver routing and middleware
//
WebService.prototype.setupWebServer = function setupWebServer(/* iface */) {
  // Static asset routing (should be nginx on production)
  this.app.use('/static', express.static(path.join(__dirname, 'static')));

  // Application routes
  this.app.get('/', function(req,res) {
    res.sendfile('web/static/index.html');
  });
};


// setupSocketServer
//
WebService.prototype.setupSocketServer =  function setupSocketServer(/*iface*/) {
  var self = this;

  var xmppClients = {};

  var io = self.app.io;

  // Socket events
  io.route('connect', function() {
    debug('connect');
  });
  io.route('disconnect', function() {
    debug('disconnect');
  });

  // Messages without a token
  //
  io.route('userGetAuthToken', function (req) {
    self.iface.clients.scatter_api.userGetAuthToken(req.data, function (err, result) {
      req.io.emit('userGetAuthTokenResponse', {err: err, result: result});
    });
  });

  io.route('userSignUp', function (req) {
    self.iface.clients.scatter_api.userSignUp(req.data, function (err, result) {
      req.io.emit('userSignUpResponse', {err: err, result: result});
    });
  });

  // RPC calls (with token)
  //  Todo: check for existence of token here
  //
  io.route('startXmppClient', function (req) {
    var requestId = req.data._meta.requestId;
    var token = req.data._meta.authToken;

    var rq = {authToken: req.data._meta.authToken};
    self.iface.clients.scatter_api.userGetMe(rq, function (err, result) {
      if (err) return req.io.emit(requestId, {err: err});

      var jid = {
        username: result.username,
        password: token
      };
      if (!xmppClients[jid.username]) {
        xmppClients[jid.username] = new XmppClient(jid, req.io);
      }
      return req.io.emit(requestId, {err: null, result: 1});
    });
  });

  io.route('userGetMe', function (msg) {
    var rq = {
      authToken: msg.data._meta.authToken
    };
    self.iface.clients.scatter_api.userGetMe(rq, function (err, result) {
      msg.io.emit(msg.data._meta.requestId, {err: err, result: result});
    });
  });

  io.route('userContactRequest', function(msg) {
    // Add to database
    // Send message
  });
};


// Error handler implementation
//
function errorHandler(err, req, res, next){
  var message = 'Oh noes, Scatter is broken!\n\n';
  if (err && err.stack) {
    console.error('!!', err.stack);
    message += err.stack;
  }
  res.set('Content-Type', 'text/plain');
  res.status(500).send(message);
}



// Exports
//
module.exports = WebService;
