/* jshint node:true, mocha: true */
"use strict";
var path = require('path');

var expect = require('expect.js');
var m1cro = require('m1cro');
var uuid = require('node-uuid');

var ApiService = require(path.join(__dirname, '..', 'api', 'apiservice'));


/**
 * Config
 *   TODO: Move to separate file
 */
var apiConfig = {
  db: {
    hostname: 'localhost',
    port: 28015,
    db: 'mist_unittest'
  }
};


/**
 * Start M1cro interface
 */
var iface = m1cro.interface();
iface.on('start', runTests);
iface.service(ApiService, 'apiService', {config: apiConfig});
iface.client('apiService', {
  api: ['userSignUp']
});
iface.start();


/**
 * Test modules
 */
function runTests() {
  describe('user service', userTests);
}



/**
 * User testing
 */
function userTests() {
  var api = iface.clients.apiService;

  var userId = uuid.v4();
  var signupData = {
      username: 'user+'+userId,
      password: userId,
      email: userId+'@tester.com'
  };

  it('should be able to signup a user', function (done) {
      api.userSignUp(signupData, function (err, result) {
          expect(err).to.be(null);
          return done();
      });
  });

  it('should not be a able to signup another with the same email address');

  // it('should be able to create a authToken for a user', function (done) {

  // })
}
