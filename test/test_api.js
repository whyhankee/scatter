/* jshint node:true, mocha: true */
"use strict";
var path = require('path');

var expect = require('expect.js');
var m1cro = require('m1cro');
var uuid = require('node-uuid');
var async = require('neo-async');
var _ = require('lodash');

var ApiService = require(path.join(__dirname, '..', 'api', 'apiservice'));


// Config
// TODO: Move to separate file
var apiConfig = {
  db: {
    hostname: 'localhost',
    port: 28015,
    db: 'scatter_unittest'
  }
};


// Start M1cro interface
//
var iface = m1cro.interface();
iface.on('start', runTests);
iface.service(ApiService, 'apiService', {config: apiConfig});
iface.client('apiService', {
  api: [
    'userSignUp', 'userGetAuthToken', 'userGetMe',
    'contactRequest', 'contactList', 'contactDelete'
  ]
});
iface.start();


// Test modules
//
function runTests() {
  describe('user tests', userTests);
  describe('contact tests', contactTests);
}



// User testing
//
function userTests() {
  var authToken;
  var api = iface.clients.apiService;

  var userId = uuid.v4();
  var signupData = {
      id: userId,
      username: 'user+'+userId,
      password: userId,
      email: userId+'@tester.com'
  };

  it('should signup a user', function (done) {
    api.userSignUp(signupData, function (err) {
      expect(err).to.be(null);
      return done();
    });
  });

  it('should not be a able to signup another with the same email address', function (done) {
    var dataDupEmail = {
      username: 'user+'+userId+'diff',
      password: userId,
      email: userId+'@tester.com'
    };
    api.userSignUp(dataDupEmail, function (err) {
      expect(err.message).to.be('duplicateEmail');
      return done();
    });
  });

  it('should not be a able to signup another with the same username', function (done) {
    var dataDupUsername = {
      username: 'user+'+userId,
      password: userId,
      email: userId+'@tester.com'+'diff'
    };
    api.userSignUp(dataDupUsername, function (err) {
      expect(err.message).to.be('duplicateUsername');
      return done();
    });
  });

  it('should create a authToken for a valid username.pwd', function (done) {
    api.userGetAuthToken(signupData, function (err, result) {
      authToken = result.token;

      expect(err).to.be(null);
      expect(result.token).to.be.ok();
      return done();
    });
  });

  it('should *not* create a authToken for a invalid pwd', function (done) {
    var invalidSignupData = signupData;
    invalidSignupData.password = 'invalid';
    api.userGetAuthToken(invalidSignupData, function (err, result) {
      expect(err).not.to.be(null);
      expect(err.name).to.be('Error');
      expect(err.message).to.be('invalidUsernamePassword');
      expect(result).to.be(undefined);
      return done();
    });
  });

  it('should get the users own data', function (done) {
    var body = {authToken: authToken};
    api.userGetMe(body, function (err, user) {
      expect(err).to.be(null);
      expect(user.id).to.be(signupData.id);
      expect(user.username).to.be(signupData.username);
      expect(user.email).to.be(signupData.email);
      return done();
    });
  });

}


function contactTests() {
  var api = iface.clients.apiService;
  var user;
  var contact;
  var contactName = 'contact_' + uuid.v4();

  before( function(done) {
    var userId = uuid.v4();
    var signupData = {
        username: 'user+'+userId,
        password: userId,
        email: userId+'@tester.com',
        authToken: uuid.v4()
    };
    api.userSignUp(signupData, function (err, addedUser) {
        expect(err).to.be(null);
        user = addedUser;
        return done();
    });
  });

  it('should add a contact', function (done) {
    var contactData = {
      authToken: user.authToken,
      username: contactName
    };
    api.contactRequest(contactData, function (err, addedContact) {
      expect(err).to.be(null);
      expect(addedContact.userId).to.be(user.id);
      expect(addedContact.id).not.to.be(undefined);
      expect(addedContact.username).to.be(contactData.username);
      contact = addedContact;
      return done();
    });
  });

  it('should not add a duplicate contact', function (done) {
    var contactData = {
      authToken: user.authToken,
      username: contactName
    };
    api.contactRequest(contactData, function (err) {
      expect(err).not.to.be(null);
      return done();
    });
  });

  it('should return a contact list', function (done) {
    var contactData = {
      authToken: user.authToken,
    };

    api.contactList(contactData, function (err, contactList) {
      expect(err).to.be(null);
      expect(contactList.length).to.be(1);
      return done();
    });
  });

  it('should return a empty contact list for unkown user', function (done) {
    var userId = uuid.v4();
    var signupData = {
      username: 'user+'+userId,
      password: userId,
      email: userId+'@tester.com',
      authToken: uuid.v4()
    };
    var emptyUser;

    async.waterfall([signupUser,testContactList], done);

    function signupUser (cb) {
      api.userSignUp(signupData, function (err, addedUser) {
        expect(err).to.be(null);
        emptyUser = addedUser;
        return cb();
      });
    }

    function testContactList (cb) {
      api.contactList({authToken: emptyUser.authToken}, function (err, contactList) {
        expect(err).to.be(null);
        expect(contactList.length).to.be(0);
        return cb();
      });
    }
  });

  it ('should delete a contact', function (done) {
    var userData = {
      authToken: user.authToken,
      userId: user.id,
      contactId: contact.id
    };
    api.contactDelete(userData, function (err, result) {
      expect(err).to.be(null);
      expect(result).not.to.be(undefined);

      api.contactList({authToken: user.authToken}, function (err, contactList) {
        expect(err).to.be(null);
        expect(contactList.length).to.be(0);
        return done();
      });
    });
  });

  it ('should not delete a other users contact');
}
