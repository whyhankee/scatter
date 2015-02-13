/* jshint node: true */
"use strict";
var path = require('path');

var makeError = require(path.join(__dirname, 'makeError'));


// Our errors
//
module.exports = {
  // Setup Errors
  ConfigNotFound: makeError("ErrorConfigNotFound"),
};

