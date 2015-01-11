/* jshint node: true */
"use strict";
var os = require('os');
var path = require('path');
var util = require('util');

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');


/**
 * Globals
 */
var mistApiCalls = [
  'userGetAuthToken'
];


/**
 * Our WebServer service
 */
function WebService(iface, qname, options) {
  iface.client('mistApi', {api: mistApiCalls});

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

  // Static asset routing (nginx on production)
  this.app.use('/static', express.static(path.join(__dirname, 'static')));

  // Route middleware
  this.app.use(function(req, res, next) {
    req.api = req.app.get('iface').clients.mistApi;
    return next();
  });

  // Routes
  this.app.get('/', getIndex);
  this.app.get('/login', getLogin);
  this.app.post('/login', postLogin);

  // .. errorHandler last
  this.app.use(errorHandler);
}


WebService.prototype.onStart = function(done) {
  var config = this.app.get('config');

  // Start Express server
  this.app.listen(config.server.port, function (err) {
    if (err) return done(err);

    console.log(util.format(
      'Mist Web service started at http://%s:%d/',
      os.hostname(), config.server.port
    ));
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


function getLogin(req, res) {
  showPage('login', {}, req, res);
}


function postLogin(req, res, next) {
  var tokenData = {
    username: req.body.username,
    password: req.body.password
  };
  req.api.userGetAuthToken(tokenData, function (err, token) {
    if (err) return req.next(err);

    // set cookie

    // Redirect to homepage
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
