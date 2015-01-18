/* jshint node: true */
"use strict";
var util = require('util');


/**
 * Our Logging middleware
 */
var logger = {
  pre: function timerStart(req) {
    req.s.timerStart = Date.now();
    return req.next();
  },

  post: function timerStop(req) {
    console.log(util.format('API :%s(%s) - %s, %dms',
      req.message,
      util.inspect(req.data),
      req.response.err === null ? "Ok" : "Error",
      Date.now()-req.s.timerStart)
    );
    return req.next();
  }
};


/**
 * Exports
 */
module.exports = logger;
