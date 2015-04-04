/* jshint node: true */

var config = {
  api: {
    db: {
      hostname: 'localhost',
      port: 28015,
      db: 'scatter'
    }
  },

  web: {
    server: {
      port: 2460
    }
  }
};


module.exports = config;
