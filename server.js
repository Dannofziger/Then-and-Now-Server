'use strict';

var express = require('express');
var mongoose = require('mongoose');
//var passport = require('passport');
var userRoutes = require('./routes/userRoutes');
//var passport = require('passport');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/tan_development');

var app = express();
var userRouter = express.Router();

console.log("in server.js calling userRoutes(userRouter)");
//userRoutes(userRouter, passport, app.get('appSecret'));
userRoutes(userRouter);

console.log("in server.js calling app.use(userRouter)");
app.use('/api/v1', userRouter);

console.log("in server.js starting webserver by calling app.listen()");
// start up the app to listen for incoming requests on PORT environment variable OR  3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});

