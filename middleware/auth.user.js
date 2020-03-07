module.exports.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}else{
		res.redirect('/')
	}
}
module.exports.notLoggedIn = function(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/')
	}
}
// user products
module.exports.isLoggedInP = function(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}else{
		// set link url
		req.session.oldUrl = req.url
		res.redirect('/user/signin')
	}
}
// redirect loggin
module.exports.Resign = function(req, res, next){
	if(req.session.oldUrl){
		var link = req.session.oldUrl
		req.session.oldUrl = null
		// console.log(link)
		res.redirect('/products/'+link)
	}else{
		res.redirect('/user/profile')
	}
}
