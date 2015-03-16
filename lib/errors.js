/* jshint node: true */
"use strict";
var path = require('path');


// Custom errors
var makeError = require(path.join(__dirname, 'makeError'));


// Exports
module.exports = {
  // Setup Errors
  ConfigNotFound: makeError("ErrorConfigNotFound"),
};

