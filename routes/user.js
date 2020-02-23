var express = require('express');
var csrf = require('csurf');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport')
const { check, validationResult } = require('express-validator');
const userControl = require('../controller/user.control.js');


// router goes here
var csrfProtection = csrf({});
router.use(csrfProtection);

// Defaul router
router.all('/', function(req, res){
	return res.json({
		status: true,
		message: 'User controller working...'
	});
});
router.get('/signup', userControl.getSignup)
router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
 	failureRedirect: '/user/signup',
 	failureFlash: true
 }));

router.get('/profile', userControl.getprofile)

module.exports = router;