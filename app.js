var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();

var indroute = require('./routes/index');
var recroute = require('./routes/recipes');
var ingroute = require('./routes/ingredients');
var listroute = require('./routes/shopping');


var app = express();
var db = new sqlite3.Database('data/greedy.db')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
 req.db = db;
 next();
});

app.use('/', indroute);
app.use('/recipes', recroute);
app.use('/ingredients', ingroute);
app.use('/lists', listroute);
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
 app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
   message: err.message,
   error: err
  });
 });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
  message: err.message,
  error: {}
 });
});

module.exports = app;
