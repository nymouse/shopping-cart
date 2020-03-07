const session = require('express-session');
const Cart = require('../models/addproducts.model.js');
const Order = require('../models/Order.model.js');

module.exports.getSignup = function(req, res, next){
	const message = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), message: message, hasError: message.length>0})
}
// module.exports.postSignup = function(req, res, next){
// 	res.redirect('/');
// }
module.exports.getprofile = function(req, res, next){
	const message = req.flash('error');
	// get bill user show here
	Order.find({user: req.user}, function(err, result){
		if(err){
			return res.write('Error')
		}
		let cart;
		// loop orders list
		result.forEach(function(order){
			cart = new Cart(order.cart)
		order.items = cart.generateArray()
			console.log(order.items)
		})
		res.render('user/profile', {result: result});
	})	
}
// signin
module.exports.getSignin = function(req, res, next){
	const message = req.flash('error');
	res.render('user/signin', {csrfToken: req.csrfToken(), message: message, hasError: message.length>0})
}
// Logout 
module.exports.getLogout = function(req, res){
	req.logout();
	const cart = new Cart(req.session.cart ? req.session.cart : {});
	req.session.cart = null
	res.redirect('/')
}