module.exports.getSignup = function(req, res, next){
	const message = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), message: message, hasError: message.length>0})
}
// module.exports.postSignup = function(req, res, next){
// 	res.redirect('/');
// }
module.exports.getprofile = function(req, res, next){
	res.render('user/profile');
}