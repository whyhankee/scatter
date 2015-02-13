/* jshint node: true */
"use strict";
var util = require('util');


/**
 * Generate a custom error class based on Error
 * @param  {String} name          Name of your Error object .e.g. ErrorNotFound
 * @param  {Object} errorProps    Properties to set in every created Object for this Error class
 * @param  {Object} opts          Options
 * @param  {Object} opts.addContext Add context to message when building an Error
 * @return {function}             The created error object
 */
function makeError(name, errorProps, opts) {
  if (!name || (errorProps !== undefined && typeof errorProps !== 'object')) {
    throw new Error('invalidArguments');
  }

  if (errorProps === undefined) errorProps = {};
  if (opts === undefined) opts = {};
  if (opts.addContext === undefined) opts.addContext = true;

  var ex = function (message, context) {
    var self = this;

    // if we only get a context: message = context
    if (typeof message === 'object' && context === undefined) {
      context = message;
      message = JSON.stringify(context);
    }

    if (message === undefined) message = '';
    if (opts.addContext && context !== undefined) {
      message += ' ' + JSON.stringify(context);
    }

    Error.call(self);
    Error.captureStackTrace(self, self.constructor);
    self.name = name;
    self.message = message;
    self.context = context;

    Object.keys(errorProps).forEach( function (k) {
      self[k] = errorProps[k];
    });
  };
  util.inherits(ex, Error);

  return ex;
}


// Exports
//
module.exports = makeError;
