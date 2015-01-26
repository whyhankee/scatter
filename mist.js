/* jshint node: true */
"use strict";
var path = require('path');

// The service manaager
var m1cro = require('m1cro');
var SessionService = require('m1cro-svc-express-session-rethinkdb');

// Our services that make up our Application
var WebService = require(path.join(__dirname, 'web', 'webservice'));
var ApiService = require(path.join(__dirname, 'api', 'apiservice'));


// Move to external file
var config = {
  api: {
    queue: {
      name: 'mist_api'
    },
    db: {
      hostname: 'localhost',
      port: 28015,
      db: 'mist'
    }
  },

  session: {
    queue: {
      name: 'mist_session'
    },
    db: {
      hostname: 'localhost',
      port: 28015,
      db: 'mist_session'
    }
  },

  web: {
    queue: {
      name: 'mist_web'
    },
    server: {
      port: 2460
    }
  }
};


/**
 * Setup Interface using loopback transport (default)
 * Setup our services .. and start!
 */
var iface = m1cro.interface({appName: 'mist'});

// Attach services to the Service Manager
iface.service(ApiService, config.api.queue.name, {config: config.api});
iface.service(SessionService, config.session.queue.name, {config: config.session});
iface.service(WebService, config.web.queue.name, {config: config.web});

// Register middleware on the services
var serviceLogger = m1cro.middleware.logger;
iface.serviceUse(config.api.queue.name, serviceLogger);
iface.serviceUse(config.session.queue.name, serviceLogger);
iface.serviceUse(config.web.queue.name, serviceLogger);

// Start services and clients
iface.start();
