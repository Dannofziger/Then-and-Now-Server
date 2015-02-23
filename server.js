var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var routes = require('./routes/userRotues');

mongoose.connect(process.env.MONGO_URI || 'mongo.db://localhost/notadb');

var app = express();
var router = express.Router();

