const passport = require('passport');
const {check, validationResult} = require('express-validator');
const User = require('../models/user.model.js');
const localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	done(null, user)
})
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user)
	})
});

passport.use('local.signup', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},
function(req, email, password, done){
	
	const errors = validationResult(req);
			// check error user signup
	if(!errors.isEmpty()){
		 var text = errors.array()
		// console.log(text)
	var message = [];
		text.forEach(function(err) {
		 message.push(err.msg)
	 });
		return  done(null, false, req.flash('error', message));
	}
	User.findOne({'email': email}, function(err, user){
		if(err){
			return  done(err);
		}
		if(user){
			return done(null, false, {message: 'Email is ready use...'});
		}
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.save(function(err, result){
			if(err){
				return done(err)
			}
			return done(null, newUser)
		})
	})
}
));
passport.use('local.signin', new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req, email, password, done){

	const errors = validationResult(req);

	if(!errors.isEmpty()){
		var text = errors.array()
		// console.log(text)
		const message = [];
		text.forEach(function(error){
			message.push(error.msg)
		})
		return done(null, false, req.flash('error', message));
		// return done(null, false, req.flash('error', message));
	}
	// find and check account user
	User.findOne({'email': email}, function(error, user){
		if(error){
			return done(error)
		}
		if(!user){
			return done(null, false, {message: 'User not exist...'})
		}
		if(!user.validPassword(password)){
			return done(null, false, {message: 'wrong password...'})
		}
		return done(null, user)
	})
}),
)