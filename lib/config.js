/* jshint node: true */
"use strict";
var path = require('path');
var util = require('util');
var os = require('os');

var makeError = require(path.join(__dirname, 'makeError'));


// Our errors
//
var errConfigNotFound = makeError("ErrorConfigNotFound");


// Globals
//
var NODE_ENV = process.env.NODE_ENV || 'test';

var config = null;
var constants ={
  api: {
    queue: {
      name: 'scatter_api'
    },
  },

  session: {
    queue: {
      name: 'scatter_session'
    },
  },

  web: {
    queue: {
      name: 'scatter_web'
    },
  }
};


// Main
//
getConfig();


/**
 * Finds and loads the config file
 * @return {[type]} [description]
 */
function getConfig() {
  var configLocations = getOsConfigLocations();
  configLocations.forEach( function (configFile) {
    if (config !== null) return;

    try {
      config = require(configFile);
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') return;
      throw new Error(e);
    }
  });

  if (!config) throw new errConfigNotFound('locations checked: '+configLocations.join(','));
}


/**
 * Returns list of possible locations for the config file
 * @return {Array} filenames
 * @private
 */
function getOsConfigLocations() {
  var locations;

  if (os.platform() === 'linux') {
    locations = [
      '/etc/scatter/'+NODE_ENV+'/scatter.js',
      '/etc/scatter/scatter_'+NODE_ENV+'.js',
    ];
  }
  else {
    throw new Error('unsupported platform '+ os.platform());
  }

  // append current location last (for development)
  locations.push(path.join(process.cwd(), 'scatter.conf.js'));
  return locations;
}


// Exports
//
exports.constants = constants;
exports.config = config;
exports.env = NODE_ENV;
