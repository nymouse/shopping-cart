// init code
var mongoose = require('mongoose');
const bcrypt = require('bcrypt')

// user Schema
const userSchema = mongoose.Schema({
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	}
});
userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password)
}
// user model
mongoose.model('user', userSchema);
// exports user
module.exports = mongoose.model('user')