/* jshint node: true */
"use strict";
var util = require('util');


/*
    Example:

    UserAddError = makeError('userAddError', {
      prop1: true,
      prop2: false
    }, {addContext: false});

    ...

    var errContext = {
      reason: 'there was an error connecting to the database',
      userId: '12344'
    };
    return cb(UserAddError('Unable to add user', errContext));
 */



/**
 * make a new Error (inherits from Error)
 * @param  {String}  name                 Becomes err.name
 * @param  {Object}  errorProps           Properties to populate on every generated error
 * @param  {Object}  opts                 Options
 * @param  {Boolean} opts.addContext      Add context to the .message string (default: true)
 * @return {Error}                        The generated error object
 */
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
