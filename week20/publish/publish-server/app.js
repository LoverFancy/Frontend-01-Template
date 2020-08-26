var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
var indexRouter = require('./routes/promiseIndex');
// var authRouter = require('./routes/auth');
var authRouter = require('./routes/promiseAuth');

var app = express();

app.use(logger('dev'));
// app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/publish', indexRouter);

module.exports = app;
