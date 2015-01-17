/* jshint node: true */
"use strict";
var util = require('util');


var logger = {
  pre: function timerStart(req) {
    req.s.timerStart = Date.now();
    return req.next();
  },

  post: function timerStop(req) {
    console.log(util.format('API %s %s %d ms',
      req.message,
      req.response.err === null ? "Ok" : "Error",
      Date.now()-req.s.timerStart)
    );
    return req.next();
  }
};


exports.logger = logger;
