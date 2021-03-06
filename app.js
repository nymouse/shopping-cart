require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
var assert = require('assert');
const MongoStore = require('connect-mongo')(session);
const db_url = process.env.DB_URL;
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var userRouter = require('./routes/user');

var app = express();

const stripe = require("stripe")(keySecret);

mongoose.connect(
	db_url,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	},
	function(error,link){
		// check error
		assert.equal(error, null, 'DB connect fail...');
		// everything OK
		console.log('DB connect Success...')
	}
);
require('./middleware/passport.js')

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
		secret: 'suppersecret',
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({mongooseConnection: mongoose.connection}),
		cookie: {maxAge: 180*60*1000}
	}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated()
	res.locals.session = req.session
	next();
})

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/user', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
