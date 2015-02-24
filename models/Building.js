//Building.js

'use strict';

var mongoose = require('mongoose');       // to read from, write to the database
//var bcrypt   = require('bcrypt-nodejs');  // to encrypt the password
//var bcrypt   = require('bcrypt');         // to encrypt the password
//var eat      = require('eat');            // to encrypt the token


var buildingSchema = new mongoose.Schema({
  longitude: String,
  latitude: String,
  buildingName: String,
  buildingAddress: String,
  city: String,
  state: String,
  zipcode: String,
  buildDate: String,
  buildCompletion: String,
  crossStreetEastWest: String,
  crossStreetNorthSouth: String,
  infosites: {
    wikipediaURL: String,
    yahooURL: String,
    googleURL: String
  },
  images: {
    url1900: String,
    url2010: String
  },
  crtTimestamp: String,
  crtUser: String,
  updtTimestamp: String,
  updtUser: String
});


module.exports = mongoose.model('Building', buildingSchema);
