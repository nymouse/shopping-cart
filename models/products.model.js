// init code
const mongoose = require('mongoose');

// products Schema
const productSchema = mongoose.Schema({
	imagepath: {
		type: String,
		require: true
	},
	title: {
		type: String,
		require: true
	},
	description: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: true
	}
});

// products model
mongoose.model('products', productSchema);
// exports product
module.exports = mongoose.model('products')