var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup - not using view engines in this app
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API's //////////////
var mongoose = require('mongoose');
mongoose.connect('mongod://localhost:27017/bookshop')

var Books = require('./models/books.js');

// ----->>> POST BOOKS <<<------
app.post('/books', function(req, res){ // http POST request on /books, will pass array of books
  var book = req.body; // copy books array to this variable

  Books.create(book, function(err, books){ // pass 'book' array as first argument using mongoose .create method, this will save to database
    if(err){ // we get response from mongo db
      throw err; // if error it will advise error
    }
    res.json(books); // otherwise returns json dataset of submitted books
  })
});

// END API's ////////////


app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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