/* jshint node: true */
"use strict";
var os = require('os');
var path = require('path');
var util = require('util');

// The service manaager
var m1cro = require('m1cro');
var serviceLogger = m1cro.middleware.logger;
var SessionService = require('m1cro-svc-express-session-rethinkdb');

// Our services that make up our Application
var webService = require(path.join(__dirname, 'web', 'webservice'));
var apiService = require(path.join(__dirname, 'api', 'apiservice'));


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
iface.service(apiService, config.api.queue.name, {config: config.api});
iface.service(SessionService, config.session.queue.name, {config: config.session});
iface.service(webService, config.web.queue.name, {config: config.web});

// Register middleware on the services
iface.serviceUse(config.api.queue.name, serviceLogger);
iface.serviceUse(config.session.queue.name, serviceLogger);
iface.serviceUse(config.web.queue.name, serviceLogger);

// Start services and clients
iface.on('start', onStart);
iface.start();


function onStart() {
  iface.log.info(util.format(
    'Mist Web service started at http://%s:%d/',
    os.hostname(), config.web.server.port
  ));
}
