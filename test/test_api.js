/* jshint node:true, mocha: true */
"use strict";
var path = require('path');

var expect = require('expect.js');
var m1cro = require('m1cro');
var uuid = require('node-uuid');

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
  api: ['userSignUp', 'userGetAuthToken', 'userGetMe']
});
iface.start();


// Test modules
//
function runTests() {
  describe('user service', userTests);
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
    api.userSignUp(signupData, function (err, result) {
      expect(err).to.be(null);

      return done();
    });
  });

  it('should not be a able to signup another with the same email address');
  it('should not be a able to signup another with the same username');

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
