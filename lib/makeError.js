/* jshint node: true */
"use strict";
var util = require('util');


function makeError(name, errorContext) {
  if (!name || (errorContext !== undefined && typeof errorContext !== 'object')) {
    throw new Error('invalidArguments');
  }
  if (errorContext === undefined) errorContext = {};

  var ex = function (message, context) {
    var self = this;
    if (context === undefined) context = {};

    Error.call(self);
    Error.captureStackTrace(self, self.constructor);
    self.name = name;
    self.message = message;

    // Set properties of 'context' on the error object
    Object.keys(context).forEach( function (k) {
      self[k] = context[k];
    });
    // Set makeError's context (overwrites previous contexts)
    Object.keys(errorContext).forEach( function (k) {
      self[k] = errorContext[k];
    });
  };
  util.inherits(ex, Error);

  return ex;
}


// Exports
//
module.exports = makeError;
