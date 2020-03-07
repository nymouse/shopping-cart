var express = require('express');
var csrf = require('csurf');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport')
const { check, validationResult } = require('express-validator');
const userControl = require('../controller/user.control.js');
const Authmiddle = require('../middleware/auth.user.js')

// router goes here
var csrfProtection = csrf({});
router.use(csrfProtection);

router.get('/profile', Authmiddle.isLoggedIn, userControl.getprofile)

router.get('/logout',Authmiddle.isLoggedIn, userControl.getLogout);
// Defaul router check 
router.use('/', Authmiddle.notLoggedIn, function(req, res, next){
	return next();
});
router.get('/signup', userControl.getSignup)
router.post(
	'/signup',
	[
		check('email').not().isEmpty().isEmail().normalizeEmail().withMessage('must be a Email'),
		check('password').not().isEmpty().isLength({min:4}).withMessage('Password must be at least 5 chars long')
	],
	passport.authenticate('local.signup', {
 	failureRedirect: '/user/signup',
 	failureFlash: true
 }), Authmiddle.Resign);
// signin
router.get('/signin', userControl.getSignin);
router.post('/signin',
	[
		check('email').not().isEmpty().isEmail().withMessage('E-mail not found...'),
		check('password').not().isEmpty().withMessage('password is not Empty...')
	],
	passport.authenticate('local.signin', {
		failureRedirect: '/user/signin',
		failureFlash: true
	}),
	Authmiddle.Resign
)

module.exports = router;