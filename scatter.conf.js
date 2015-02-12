/* jshint node: true */

var config = {
  api: {
    db: {
      hostname: 'localhost',
      port: 28015,
      db: 'scatter'
    }
  },

  session: {
    db: {
      hostname: 'localhost',
      port: 28015,
      db: 'scatter_session'
    }
  },

  web: {
    server: {
      port: 2460
    }
  }
};


module.exports = config;
