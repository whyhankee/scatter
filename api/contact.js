/* jshint node: true */
"use strict";
var util = require('util');
var async = require('neo-async');
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
      return req.done(new Error('invalidArguments: ' + util.inspect(err)));
    }

    async.auto({
      checkDupContact: checkDupContact,
      saveContact: ['checkDupContact', saveContact]
    }, onDone);

    function checkDupContact (cb, results) {
      self.Contact.filter({username: args.username, userId: req.user.id}).run().nodeify(function (err, users) {
        if (users.length) return cb(new Error('duplicateContact'));
        return cb();
      });
    }
    function saveContact (cb, results) {
      var newContact = new self.Contact({
        userId: req.user.id,
        username: args.username,
        following: true,
        created: new Date(),
        accepted: null
      });
      // send event.contact.request.success(id: contactId)
      newContact.save().nodeify(cb);
    }
    function onDone(err, result) {
      if (err) return req.done(err);
      req.done(null, result.saveContact);
    }

  });
}

// Contact list
//
function contactList (req) {
  var self = this; // jshint ignore:line

  self.Contact.orderBy("username").
    filter({userId: req.user.id}).run(function (err, contacts)
  {
    if (err)  return req.done(err);
    return req.done(null, contacts);
  });
}

// Delete contact
function contactDelete (req) {
  var self = this; // jshint ignore:line
  console.log('***');
  var template = {
    contactId: {required: 1, defined: 1}
  };
  oap.check(req.body, template, function (err, args) {
    if (err) {
      return req.done(new Error('invalidArguments: ' + util.inspect(err)));
    }
    var filter = {
      id: args.contactId,
      userId: req.user.id
    };
    console.log('***', filter);
    self.Contact.filter(filter).run(function (err, contact) {
      if (err) return req.done(err);
      console.log('***', err, contact);
      contact[0].delete().nodeify(function (err, result) {
        console.log('###', err, result);
        return req.done(err, result);
      });
    });
  });
}

// Exports
//
module.exports = {
  request: contactRequest,
  list: contactList,
  delete: contactDelete
};
