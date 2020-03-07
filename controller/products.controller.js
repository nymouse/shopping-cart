require('dotenv').config()
const { check, validationResult } = require('express-validator');
const session = require('express-session');
const keySecret = process.env.SECRET_KEY;
const keyPublishable = process.env.PUBLISHABLE_KEY;
const stripe = require("stripe")(keySecret);
const Product = require('../models/products.model');
const Cart = require('../models/addproducts.model.js');
const Order = require('../models/Order.model.js')
// product index
module.exports.product = function(req, res){
	const msgSuccess = req.flash('success')[0];
	Product.find(function(err, docs){
		var productchunk = [];
		var chunkSize = 4;
		for(var i = 0; i< docs.length; i+= chunkSize ){
			productchunk.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index',{
		products: productchunk,
		msgSuccess: msgSuccess,
		noMsg: !msgSuccess
	});
	});
};

// product create
module.exports.create = function(req, res){
	console.log(req.file)
	const filez = req.file
	res.render('shop/createP', {noErr: !filez});
};

// product post vilidate
module.exports.Postproduct = function(req, res){
	// check validation error
	
	const message = [];
	const errors = validationResult(req);
		if(!errors.isEmpty()){
			// return	res.status(422).json({
			// 	status: false,
			// 	message: "Form validation errors...",
			// 	errors: errors.array()
			// })
		let err = errors.array();
		console.log(err)	
		err.forEach(function(error){
			const x = error.msg
			message.push(x)
		})
		return res.render('shop/createP', {err: message})
		};
	req.body.imagepath = req.file.path.split('/').slice(1).join('/');
	// console.log(req.file);
	var pronew = new Product({
		imagepath: req.body.imagepath,
		title: req.body.title,
		description: req.body.description,
		price: req.body.price
	});
	pronew.save(function(error, result){
		// check error
		if(error){
			return res.render('shop/createP',{
				error: error
			})
		}
		// if everything OK
		return res.redirect('/products')
	})
}
// add to cart
module.exports.addCart = function(req, res, next){
	const productId = req.params.id;
	const cart = new Cart(req.session.cart ? req.session.cart : {});
	// find Products

	Product.findById(productId, function(err, product){
		if(err){
			return res.redirect('/products')
		}
		// add products on cart
		cart.add(product, product.id);
		// create req.session.cart
		req.session.cart = cart;
		console.log(cart)
		res.redirect('/products');
	})
}
// reduce products
module.exports.reduceByP = function(req, res, next){
	const productId = req.params.id
	const cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reducebyOne(productId);
	req.session.cart = cart
	res.redirect('/products/shop-cart')
}
// remove all products
module.exports.removeAll = function(req, res, next){
	const productId = req.params.id;
	const cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeAll(productId)
	req.session.cart = cart
	res.redirect('/products/shop-cart')
}

// page shop-cart
module.exports.shopCart = function(req, res, next){
	if(!req.session.cart){
		return res.render('shop/shop-cart', {products: null})
	}
	const cart = new Cart(req.session.cart);
	// console.log(cart.generateArray())
	// console.log(cart.totalPrice)
	res.render('shop/shop-cart', {products: cart.generateArray(),totalPrice: cart.totalPrice})
}
// checkout
module.exports.checkOut = function(req, res, next){
	// const keyPublishable = keyPublishable
	
	if(!req.session.cart){
		return res.redirect('/product/shop-cart', {products: null})
	}
	const cart = new Cart(req.session.cart);
	const totalAmount = cart.totalPrice*100
	// msg flash charge error
	const errMsg = req.flash('error')[0];
	return res.render('shop/checkout', {totalpay: totalAmount, total: cart.totalPrice, errMsg: errMsg, noError: !errMsg, keyPublishable})
}
module.exports.postCheckout = function(req, res, next){
	// const stripe = require('stripe')('sk_test_LENSAreIatI3SF4Oj0Ma7yBz008jADREtO');
// Token is created using Stripe Checkout or Elements!
// Get the payment token ID submitted by the form:
// apikey
	stripe.charges.retrieve('ch_1GIXR6Ka8OGEmrBIbTsePWs6', {
		apiKey: keySecret
	});

	const token = req.body.stripeToken; 
	if(!req.session.cart){
		return res.redirect('/products/shop-cart')
	}
	const cart = new Cart(req.session.cart);
	// const totalAmount = cart.totalPrice*100
	// console.log(token)
	// console.log(totalAmount)
	// stripe.customers.create({
	// 	email: req.body.stripeEmail,
	// 	source: req.body.stripeToken
	// })
	// .then(customer =>
	// 	stripe.charges.create({
	// 		amount: cart.totalPrice*100,
	// 		description: "Sample Charge",
	// 		currency: "usd",
	// 		customer: customer.id
	// 	}))
	// .then(charge => {
	// 	req.flash('success', 'successfully bought products')
	// 	req.session.cart = null
	// 	res.redirect('/products')
	// } 
		
	// );
	console.log(req.body.stripeToken)
	
	stripe.charges.create({
		amount: cart.totalPrice*100,
		currency: 'usd',
		source: token,
		description: 'test charge'
	}, function(err, charge){
		if(err){
			req.flash('error', err.message);
			return res.redirect('/products/checkout')
		}
		// schema order
		// req.user you need signin
		console.log(req.user)
		const order = new Order({
			user: req.user,
			cart: cart,
			email: req.body.stripeEmail,
			paymentId: charge.id
		})
		// save user order
		order.save(function(err, charge){
			req.flash('success', 'successfully bought products')
			req.session.cart = null
			res.redirect('/products')
		})
	})
}