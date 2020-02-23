const passport = require('passport')
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
))