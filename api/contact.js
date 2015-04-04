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
      userId: req.user.id,
      username: args.username,
      following: true,
      created: new Date(),
      accepted: null
    });
    // send event.contact.request.success(id: contactId)
    newContact.save().nodeify(function (err, contact) {
        if (err) return req.done(err);
        return req.done(null, contact);
    });
  });
}

// Contact list
//
function contactList (req) {
  var self = this;

  self.Contact.filter({userId: req.user.id}).run(function (err, contacts) {
    if (err)  return req.done(err);
    return req.done(null, contacts);
  });
}



// Exports
//
module.exports = {
  request: contactRequest,
  list: contactList
};
