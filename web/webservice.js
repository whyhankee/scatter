/* jshint node: true */
"use strict";
var path = require('path');
var os = require('os');
var util = require('util');

var express = require('express.io');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var connect = require('connect');
var uuid = require('node-uuid');


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

  this.app.set('iface', iface);
  this.app.set('config', options.config);

  // Middlware for WebServer *AND* ApiServer
  this.app.use(morgan(isProduction ? 'combined' : 'dev'));
  this.app.use(function(req, res, next) {
    req.api = req.app.get('iface').clients.scatter_api;
    return next();
  });

  // Setup components
  this.setupApiServer(iface);
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
WebService.prototype.setupApiServer = function setupWebServer(iface) {
  this.app.use(bodyParser.json());

  // thinking about routes we need in the first place
  this.app.post('/contact/:userid/request', ApiNotImplemented);
  this.app.post('/notify/:userid', ApiNotImplemented);
  this.app.post('/timelineitem', ApiNotImplemented);

  // oAuth provider stuff?
};


function ApiNotImplemented(req, res, next) {
    return next('notImplemented');
}



// Setup Webserver routing and middleware
//
WebService.prototype.setupWebServer = function setupWebServer(iface) {
  var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

  this.app.use(allowCrossDomain);
  this.app.use(bodyParser.urlencoded({ extended: false }));

  // Static asset routing (should be nginx on production)
  this.app.use('/static', express.static(path.join(__dirname, 'static')));

  // Application routes
  this.app.get('/', function(req,res) {
    res.sendfile('web/static/index.html');
  });
};


// setupSocketServer
//
WebService.prototype.setupSocketServer =  function setupSocketServer(iface) {
  var self = this;

  var io = self.app.io;

  io.route('ready', function (req) {
    console.log('***** socket server ready');
  });

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
  io.route('userGetMe', function (msg) {
    var rq = {
      authToken: msg.data._meta.authToken
    };
    self.iface.clients.scatter_api.userGetMe(rq, function (err, result) {
      msg.io.emit(msg.data._meta.requestId, {err: err, result: result});
    });
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


// WebRoute implementations
//
function getIndex(req, res) {
  showPage('index', {}, req, res);
}


function showPage(page, data, req, res) {
  var options = {
    pretty: isProduction ? false : true
  };
  res.render(page+'.jade', options, function(err, html) {
    if (err) console.log("\nerror: ", err);

    res.send(html);
  });
}


// Exports
//
module.exports = WebService;
