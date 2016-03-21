'use strict';
var path = require('path');
var os = require('os');

var error = require(path.join(__dirname, 'errors'));


// Globals
//
var NODE_ENV = process.env.NODE_ENV || 'dev';

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
  },

  xmppserver: {
    queue: {
      name: 'xmppserver'
    },
  }
};


// Main
//
getConfig();


/**
 * Finds and loads the config file
 * @private
 */
function getConfig() {
  var configLocations = getOsConfigLocations();
  configLocations.forEach( function (configFile) {
    // config already loaded?
    if (config !== null) return;

    try {
      config = require(configFile);
    }
    catch (e) {
      // ignore ModuleNotFound - it's expected
      if (e.code === 'MODULE_NOT_FOUND') return;
      // Throw unexpected error
      throw new Error(e);
    }
  });

  if (!config) throw new error.ConfigNotFound({locations: configLocations});
}


/**
 * Returns list of possible locations for the config file
 * @return {Array} filenames
 * @private
 */
function getOsConfigLocations() {
  var locations = [];

  if (os.platform() === 'linux') {
    locations = [
      '/etc/scatter/'+NODE_ENV+'/scatter.js',
      '/etc/scatter/scatter_'+NODE_ENV+'.js',
    ];
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
