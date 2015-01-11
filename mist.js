/* jshint node: true */
"use strict";
var os = require('os');
var util = require('util');

var m1cro = require('m1cro');
var webService = require('./web/webservice');
var apiService = require('./api/apiservice');


/**
 * Globals
 */
var config = {
  web: {
    server: {
      port: 2460
    }
  },
  api: {
    db: {
      hostname: 'localhost',
      port: 28015,
      db: 'mist'
    }
  }
};


/**
 * Setup Interface using loopback transport (default)
 * Setup our services .. and start!
 */
var iface = m1cro.interface({appName: 'mist'});
iface.service(apiService, 'mistApi', {config: config.api});
iface.service(webService, 'mistWeb', {config: config.web});
iface.on('start', onStart);
iface.start();


function onStart() {
  console.log('Mist started!');
}
