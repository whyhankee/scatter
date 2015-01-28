/* jshint node: true */
"use strict";

var express = require('express.io');
/**
 * Globals
 */
var router = express.Router();
var isProduction = process.env.NODE_ENV.match(/^prod/);




/**
 * Setup routes
 */
console.log('***** express', express);
router.get('/', getIndex);
router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/signup', getSignUp);
router.post('/signup', postSignUp);



/**
 * Route implementation
 */
function getIndex(req, res) {
  showPage('index', {}, req, res);
}


function getLogin(req, res) {
  showPage('login', {}, req, res);
}


function postLogin(req, res, next) {
  if (req.body.action === 'Login') {
    var loginForm = {
      username: req.body.username,
      password: req.body.password
    };
    req.api.userGetAuthToken(loginForm, function (err, ti) {
      if (err) return req.next(err);

      req.session.userAuthToken  = ti.token;
      res.redirect('/');
    });
  }
}



function getSignUp(req, res) {
  showPage('signup', {}, req, res);
}


function postSignUp(req, res, next) {
  // signup
  //  use trackerID as userID field
  var signupData = {
    id: req.session.userTrackerId,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  };

  req.api.userSignUp(signupData, function (err, token) {
    if (err) return req.next(err);
    res.redirect('/');
  });
}



/**
 * Helper function
 */
function showPage(page, data, req, res) {
  var options = {
    pretty: isProduction ? false : true
  };
  res.render(page+'.jade', options, function(err, html) {
    if (err) console.log("\nerror: ", err);

    res.send(html);
  });
}


/**
 * Exports
 */
module.exports = router;
