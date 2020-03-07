var express = require('express');
var multer  = require('multer');
const path = require('path');
var router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const productControl = require('../controller/products.controller.js');
const Cart = require('../models/addproducts.model.js')
const Authmiddle = require('../middleware/auth.user.js')


// middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));


// var upload = multer({ dest: './public/uploads/' });
// set storage engine
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb){
		cb(null, file.fieldname+ '-'+Date.now()+ path.extname(file.originalname))
	}
})

const fileFilter = function(req, file, cb){
	// reject a file
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
		cb(null, true)
	}else{
		cb(null, false)
	}

}

// init uploads
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024*1024*5
	},
	fileFilter: fileFilter
})


/* GET home page. */
router.get('/', productControl.product)

// add products to cart 
router.get('/add-to-cart/:id', productControl.addCart);

// reduce by 1 products	
router.get('/reduce/:id', productControl.reduceByP)

// remove All products
router.get('/remove/:id', productControl.removeAll)

// page cart menu
router.get('/shop-cart', productControl.shopCart)

// checkout cart
router.get('/checkout', Authmiddle.isLoggedInP, productControl.checkOut)

// post checkout
router.post('/checkout', Authmiddle.isLoggedInP, productControl.postCheckout)

// products create index
router.get('/createP', Authmiddle.isLoggedInP, productControl.create)
// create product
router.post(
	'/createP',
	upload.single('imagepath'),
	function(req, res, next){
		var fileX = req.file;
		const message = 'Not Found Image Or File Is Not An Image.  ';
		const error = [];
		if(!fileX){
			return res.render('shop/createP',{no: message})
		}
		next()
	},
	[
		// check not empty fields
		check('title').not().isEmpty().withMessage('Title is Not Found...'),
		check('description').not().isEmpty().withMessage('Description is Not Found...'),
		check('price').not().isEmpty().withMessage('Price is Not Found...')
	],
	productControl.Postproduct
);


module.exports = router;
