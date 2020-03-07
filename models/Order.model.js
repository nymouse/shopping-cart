const mongoose = require('mongoose');

// products Schema
const orderSchema = mongoose.Schema({
	user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	cart:{type: Object, require: true},
	email:{type: String, require: true},
	paymentId:{type: String, require: true}
});

// products model
mongoose.model('Order', orderSchema);
// exports product
module.exports = mongoose.model('Order')