/* jshint node: true */
"use strict";
var path = require('path');
var util = require('util');
// var EventEmitter = require('events').EventEmitter;

var express = require('express');
var express_session = require('express-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var connect = require('connect');

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

  // In production we expect to be using HTTPS
  if (process.env.NODE_ENV && process.env.NODE_ENV.match(/^prod/)) {
    this.app.set('trust proxy', 1);     // trust first proxy
    cookieOptions.secure = true;        // serve secure cookies
  }
  this.app.use(express_session({
    secret: 'our_very_small_secret',
    name: 'sid',
    cookie: cookieOptions,
    resave: false,
    saveUninitialized: true,
    store: m1croSessionStore
  }));

  // Before routes middleware
  this.app.use(function(req, res, next) {
    req.api = req.app.get('iface').clients.mist_api;
    return next();
  });

  // Get user details of logged in user
  this.app.use(function (req, res, next) {
      var token = req.session.userAuthToken;
      if (!token) return next();

      req.api.userGetMe({authToken: token}, function(err, me) {
        req.user = me;
        return next();
      });
  });

  // Routes
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
  var signupData = {
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
