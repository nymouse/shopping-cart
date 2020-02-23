const { check, validationResult } = require('express-validator');

const Product = require('../models/products.model');
// product index
module.exports.product = function(req, res){
	Product.find(function(err, docs){
		var productchunk = [];
		var chunkSize = 4;
		for(var i = 0; i< docs.length; i+= chunkSize ){
			productchunk.push(docs.slice(i, i + chunkSize));
		}
		res.render('shop/index',{
		products: productchunk
	});
	});
};

// product create
module.exports.create = function(req, res){
	res.render('shop/createP');
};

// product post vilidate
module.exports.Postproduct = function(req, res){
	// check validation error
	const errors = validationResult(req);
		if(!errors.isEmpty()){
			return	res.status(422).json({
				status: false,
				message: "Form validation errors...",
				errors: errors.array()
			})
		};
	req.body.imagepath = req.file.path.split('/').slice(1).join('/');
	console.log(req.file);
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
		return res.json({
			status: true,
			message: 'Insert DB Sucsess...',
			result: result
		})
	})
}
