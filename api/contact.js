/* jshint node: true */
"use strict";
var util = require('util');
var async = require('neo-async');
var oap = require('oap');


// Contact request
//
function contactAdd(req) {
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

    function checkDupContact (cb) {
      var filterSpec = {username: args.username, userId: req.user.id};
      self.Contact.filter(filterSpec).run().nodeify(function (err, users) {
        if (users.length) return cb(new Error('duplicateContact'));
        return cb();
      });
    }
    function saveContact (cb) {
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

  self.Contact.
    filter({userId: req.user.id}).orderBy("username").run(function (err, contacts)
  {
    if (err)  return req.done(err);
    return req.done(null, contacts);
  });
}


/**
 * @method contactDelete
 * @public
 * Remove contact from database
 * Check if a contactId is provided, query for the contact and delete
 * @param  {Object} req Request object
 * @return {function} req.done Return function with err(or) and if succesfull result
 */
function contactDelete (req) {
  var self = this; // jshint ignore:line

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
    self.Contact.filter(filter).run(function (err, contact) {
      if (err) return req.done(err);
      if (contact.length === 0) return req.done(new Error('noContactFound'));
      contact[0].delete().nodeify(function (err, result) {
        return req.done(err, result);
      });
    });
  });
}


// Exports
//
module.exports = {
  add: contactAdd,
  list: contactList,
  delete: contactDelete
};
