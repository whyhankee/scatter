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
var apiService = require(path.join(__dirname, 'api', 'apiservice'));
var webServer = require(path.join(__dirname, 'webserver', 'webserver'));


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

  webserver: {
    queue: {
      name: 'mist_webserver'
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
iface.service(SessionService, config.session.queue.name, {config: config.session});
iface.service(apiService, config.api.queue.name, {config: config.api});
iface.service(webServer, config.webserver.queue.name, {config: config.webserver});

// Register middleware on the services
iface.serviceUse(config.session.queue.name, serviceLogger);
iface.serviceUse(config.api.queue.name, serviceLogger);
iface.serviceUse(config.webserver.queue.name, serviceLogger);

// Start services and clients
iface.on('start', onStart);
iface.start();


function onStart() {
  iface.log.info(util.format(
    'Mist Web service started at http://%s:%d/',
    os.hostname(), config.webserver.server.port
  ));
}
