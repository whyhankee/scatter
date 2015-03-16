/* jshint node: true */
"use strict";
var util = require('util');


function makeError(name, errorProps, opts) {
  errorProps = errorProps || {};
  opts = opts || {};
  if (opts.addContext === undefined) opts.addContext = true;

  var ex = function (message, context) {
    if (typeof message === 'object' && context === undefined) {
      context = message;
      message = util.inspect(context);
    }
    else if (opts.addContext && context !== undefined) {
      message += ' ' + util.inspect(context);
    }

    // Build the error, set the context
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);
    this.name = name;
    this.message = message;
    this.context = context;

    // Add default error properties
    for (var k in errorProps) this[k] = errorProps[k];
  };
  util.inherits(ex, Error);

  return ex;
}


// Exports
//
module.exports = makeError;
