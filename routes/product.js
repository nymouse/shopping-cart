var express = require('express');
var multer  = require('multer');
const path = require('path');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const productControl = require('../controller/products.controller.js');

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
		cb(new Error('This is not a image'), false)
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


// products create index
router.get('/createP', productControl.create)
// create product
router.post(
	'/createP',
	upload.single('imagepath'),
	[
		// check not empty fields
		check('title').not().isEmpty(),
		check('description').not().isEmpty(),
		check('price').not().isEmpty()
	],
	productControl.Postproduct
)

module.exports = router;
