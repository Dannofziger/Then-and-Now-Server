'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var userRoutes = require('./routes/userRoutes');
var buildingRoutes = require('./routes/buildingRoutes');

//console.log("process.env.MONGO_URI = " + process.env.MONGO_URI);
//console.log('mongodb://localhost/tan_development')
var connectResult = mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/tan_development');
//console.log('connectResult = ' + connectResult);

var app = express();
app.use(passport.initialize());
require('./lib/passport_strat')(passport);

var userRouter = express.Router();
var buildingRouter = express.Router();

//console.log("in server.js calling userRoutes(userRouter)");
//userRoutes(userRouter, passport, app.get('appSecret'));
userRoutes(userRouter, passport);

//console.log("in server.js calling buildingRoutes(buildingRouter)");
buildingRoutes(buildingRouter);


//console.log("in server.js calling app.use(userRouter)");
app.use('/api/v1', userRouter);

//console.log("in server.js calling app.use(buildingRouter)");
app.use('/api/v1', buildingRouter);

//console.log("in server.js starting webserver by calling app.listen()");
// start up the app to listen for incoming requests on PORT environment variable OR  3000
app.listen(process.env.PORT || 3000, function() {
  console.log('server listening on port ' + (process.env.PORT || 3000));
});