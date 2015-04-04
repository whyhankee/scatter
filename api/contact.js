/* jshint node: true */
"use strict";
var util = require('util');

var oap = require('oap');


// Contact request
//
function contactRequest(req) {
  var self = this;    // jshint ignore:line

  var template = {
    username: {required: 1, defined: 1},
  };
  oap.check(req.body, template, function (err, args) {
    if (err) {
      return req.done(new Error('invalidArguments: '+util.inspect(err)));
    }

    var newContact = new self.Contact({
      user: req.user,
      username: args.username,
      following: true,

      created: new Date(),
      accepted: null
    });
    // send event.user.signup.success(id: newUserId)
    newContact.save().nodeify(function (err) {
        if (err) return req.done(err);
        return req.done(null);
    });
  });
}


// Exports
//
module.exports = {
  request: contactRequest
};
