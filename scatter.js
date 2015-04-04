/* jshint node: true */
"use strict";
var path = require('path');

// The micro-service manager
var m1cro = require('m1cro');


// Configuration and constants
//
var cfg = require(path.join(__dirname, 'lib', 'config'));

// Services that make up our Application
//
var SessionService = require('m1cro-svc-express-session-rethinkdb');
var WebService = require(path.join(__dirname, 'web', 'webservice'));
var ApiService = require(path.join(__dirname, 'api', 'apiservice'));
var XmppService = require(path.join(__dirname, 'xmppserver', 'xmppserver'));


// Setup Interface using loopback transport (default)
// Setup our services .. and start!
//
var iface = m1cro.interface({appName: 'scatter'});


// Attach services to the Service Manager
//
iface.service(SessionService, cfg.constants.session.queue.name, {
    config: cfg.config.session
});
iface.service(ApiService, cfg.constants.api.queue.name, {
    config: cfg.config.api
});
iface.service(WebService, cfg.constants.web.queue.name, {
    config: cfg.config.web
});
iface.service(XmppService, cfg.constants.xmppserver.queue.name, {
    config: cfg.config.xmppserver
});


// Register middleware on the services
var serviceLogger = m1cro.middleware.logger;
iface.serviceUse(cfg.constants.api.queue.name, serviceLogger);
iface.serviceUse(cfg.constants.session.queue.name, serviceLogger);
iface.serviceUse(cfg.constants.web.queue.name, serviceLogger);
iface.serviceUse(cfg.constants.xmppserver.queue.name, serviceLogger);

// Start services and clients
iface.start();
