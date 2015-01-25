/* jshint node: true */
"use strict";
var path = require('path');
var util = require('util');

var express = require('express');
var express_session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var connect = require('connect');
var uuid = require('node-uuid');

var M1croSession = require('express-session-m1cro');


/**
 * Our WebServer service
 */
function WebService(iface, qname, options) {
  this.iface = iface;
  this.qname = qname;

  // Setup Express instance and configure
  this.app = express();
  this.app.set('iface', iface);
  this.app.set('config', options.config);

  // Template configuration
  this.app.set('views', path.join(__dirname, 'views'));
  this.app.set('view engine', 'jade');

  // Server middleware
  this.app.use(bodyParser.urlencoded({ extended: false }));
  this.app.use(morgan('dev'));

  // Static asset routing (should be nginx on production)
  //  Note: before cookie handling (no cookie negotiation for statics)
  this.app.use('/static', express.static(path.join(__dirname, 'static')));

  // Setup sessions
  var m1croSessionStore = new M1croSession.Store(iface, 'mist_session');
  var cookieOptions = { secure: false };

  // In production we expect to be using HTTPS with nginx / haproxy
  if (process.env.NODE_ENV && process.env.NODE_ENV.match(/^prod/)) {
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

  // Before routes middleware
  this.app.use(function(req, res, next) {
    req.api = req.app.get('iface').clients.mist_api;
    return next();
  });

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

  this.app.get('/login', getLogin);
  this.app.post('/login', postLogin);

  this.app.get('/signup', getSignUp);
  this.app.post('/signup', postSignUp);

  // .. errorHandler last
  this.app.use(errorHandler);
}


WebService.prototype.onStart = function(done) {
  var self = this;
  var config = this.app.get('config');

  // Start Express server
  self.app.listen(config.server.port, function (err) {
    if (err) return done(err);
    return done();
  });
};


/**
 * Error handler implementation
 */
function errorHandler(err, req, res, next){
  var message = 'Oh noes, Mist is broken!\n\n';
  if (err && err.stack) {
    console.error('!!', err.stack);
    message += err.stack;
  }
  res.set('Content-Type', 'text/plain');
  res.status(500).send(message);
}


/**
 * Route implementation
 */
function getIndex(req, res) {
  showPage('index', {}, req, res);
}


/**
 * Login
 */
function getLogin(req, res) {
  showPage('login', {}, req, res);
}


function postLogin(req, res, next) {
  if (req.body.action === 'Login') {
    var loginForm = {
      username: req.body.username,
      password: req.body.password
    };
    req.api.userGetAuthToken(loginForm, function (err, ti) {
      if (err) return req.next(err);

      req.session.userAuthToken  = ti.token;
      res.redirect('/');
    });
  }
}


/**
 * Signup
 */
function getSignUp(req, res) {
  showPage('signup', {}, req, res);
}


function postSignUp(req, res, next) {
  // signup
  //  use trackerID as userID field
  var signupData = {
    id: req.session.userTrackerId,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };

  req.api.userSignUp(signupData, function (err, token) {
    if (err) return req.next(err);
    res.redirect('/');
  });
}



/**
 * Helper function
 */
function showPage(page, data, req, res) {
  res.render(page+'.jade', function(err, html) {
    if (err) console.log("\nerror: ", err);

    res.send(html);
  });
}


/**
 * exports
 */
module.exports = WebService;
