/* jshint node: true */
"use strict";
var path = require('path');
var os = require('os');
var util = require('util');

var express = require('express.io');
var express_session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var connect = require('connect');
var uuid = require('node-uuid');

var M1croSession = require('express-session-m1cro');


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
    req.api = req.app.get('iface').clients.mist_api;
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
      'Mist Web service started at http://%s:%d/',
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
  this.app.use(bodyParser.urlencoded({ extended: false }));

  // Static asset routing (should be nginx on production)
  //  Note: before cookie handling (no cookie negotiation for statics)
  this.app.use('/static', express.static(path.join(__dirname, 'static')));

  // Template configuration
  this.app.set('views', path.join(__dirname, 'views'));
  this.app.set('view engine', 'jade');

  // Setup sessions
  var m1croSessionStore = new M1croSession.Store(iface, 'mist_session');
  var cookieOptions = { secure: false };
  if (isProduction) {
    this.app.set('trust proxy', 1);
    cookieOptions.secure = true;
  }
  this.app.use(express_session({
    secret: 'our_very_small_secret',
    name: 'sid',
    resave: true,
    saveUninitialized: true,
    cookie: cookieOptions,
    store: m1croSessionStore
  }));

  // Get user details of logged-in user
  this.app.use(function (req, res, next) {
      var token = req.session.userAuthToken;
      if (!token) return next();

      req.api.userGetMe({authToken: token}, function(err, me) {
        req.user = me;
        return next();
      });
  });

  // setup TrackerId on the web-session
  //  same as the userID, used for tracing events and logging
  this.app.use(function (req, res, next) {
    req.session.userTrackerId = req.user ? req.user.id : uuid.v4();
    return next();
  });

  // Application routes
  this.app.get('/', getIndex);
};


// setupSocketServer
//
WebService.prototype.setupSocketServer =  function setupSocketServer(iface) {
  var self = this;

  self.app.io.route('ready', function (req) {
    console.log('***** socket server ready');
  });

  self.app.io.route('authenticate', function (req) {
    self.iface.clients.mist_api.userGetAuthToken(req.data, function (err, result) {
      req.io.emit('authenticateResponse', {err: err, result: result});
    });
  });
};


// Error handler implementation
//
function errorHandler(err, req, res, next){
  var message = 'Oh noes, Mist is broken!\n\n';
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
