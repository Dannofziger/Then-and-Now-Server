'use strict';

var bodyparser = require('body-parser');
var Building = require('../models/Building');
var url = require('url');
var queryString = require('querystring');
var distance = require('../lib/calc_dist_btwn_two_pts_long_lat');

module.exports = function(app){
  app.use(bodyparser.json());

  // request to get all the buildings from the database
  app.get('/building', function(req, res) {
    console.log("in buildingRoutes.js  app.get()");
    console.dir(req);

    // get the values of the parameters from the Request url
    //localhost:3000/api/v1/building?gettype=invicinity&radius=.025&long=-122.348905&lat=47.6205535 get

    console.log("req.url");
    console.log(req.url);
    var params = url.parse(req.url).query;
    console.log("url.parse(req.url).query");
    console.log(params);

    var getType = queryString.parse(params)["gettype"];
    console.log("getType = " + getType);

    if (getType === "invicinity") {
      var vicinityRadius = queryString.parse(params)["radius"]; // in miles
      console.log("vicinityRadius = " + vicinityRadius);
      var reqLong = queryString.parse(params)["long"];
      var reqLat = queryString.parse(params)["lat"];

     // reqLat = 47.6205535 get      remove "get"
      var substrReqLat = reqLat.substring(0, reqLat.length - 4);
      console.log("reqLat substring = " + substrReqLat);
      console.log("param reqLong = " + reqLong);
      console.log("param reqLat = "  + reqLat);

      console.log("in buildingRoutes.js about to call Building.find()");
      // .find() is mongoose static method on the "class" Building
      // We haven't added  "user_id" field to  models/Building.js  yet
      // Building.find({user_id: req.user._id}, function(err, data) {
      Building.find({}, function(err, data) {
        // fetch failed
        if (err) {
          console.log("in buildingRoutes.js  app.get() Building.find err = " + err);
          return res.status(500).send({'msg': 'could not retrieve buildings'});
        }
        console.log("success in Building.find()");
        console.log("data");
        //console.log(data);
        //console.dir(data);

        var dist = 0;
        var inVicinity = [];

        // loop thru all the array of buildings and
        // ... create another array of buildings
        // ... within the rectangle around lat. and long.
        // ... sent in the request
        for (var i = 0; i < data.length; i++) {
          console.log("data[i].longitude");
          console.log(data[i].longitude);
          console.log("data[i].latitude");
          console.log(data[i].latitude);
          console.log("param reqLong = " + reqLong);
          console.log("param reqLat = "  + reqLat);
          dist = distance(data[i].longitude, data[i].latitude,
            reqLong,reqLat,'M');

          // if building is "in the vicinity" of Lat and Long
          // ... in request, then add to inVicinity array
          if (dist && dist < vicinityRadius) {
            inVicinity.push(data[i]);
          }

        }  //  for (var i = 0; i < data.length; i++) {

        // success - return array of all the platypuses to the client
        //res.json(data);
        res.json(inVicinity);
      });

    }
  });

  // request to insert new buiilding in the database
  app.post('/building', function(req, res) {
    console.log('in buildingRoutes.js  app.post()');
    console.log('req.body');
    console.log(req.body);

    console.log('about to call new Building()');
    var newBuilding = new Building(req.body);
    // mongoose method .save()
    newBuilding.save(function(err, building) {

      console.log('in newBuilding.save()');
      // attempt to insert new building failed
      if (err) {
        console.log("database err = " + err);
        return res.status(500).send({'msg': 'could not save building'});
      }

      // success - return building to client  (including _id field)
      console.log("successfuly saved new Building");
      console.log(building);
      res.json(building);
    });
  });

  // request to replace a building in the database with another platypus
  app.put('/building/:id', function(req, res) {
    var updatedBuilding = req.body;
    // this is same as setting updatedPlatypus._id = null
    // ... forces update() to use the same _id when replacing the platypus
    delete updatedBuilding._id;
    Building.update({_id: req.params.id}, updatedBuilding, function(err) {
      // update/replace failed
      if (err) {
        console.log("Building.update() failed. err = " + err);
        return res.status(500).send({'msg': 'could not replace building'});
      }

      // success - return the body
      console.log("successful Building.update()")
      res.json(req.body);
    });
  });

  app.patch('', function(req, res){

  });

  // request a delete of a building
  app.delete('/building/:id', function(req, res) {
    var deletedBuilding = req.body;
    //delete deletedPlatypus._id;
    Building.remove({_id: req.params.id}, function(err) {
      // delete failed
      if (err) {
        console.log("Building.delete() failed. err = " + err);
        return res.status(500).send({'msg': 'could not delete building'});
      }

      console.log("successful building delete");
      // delete succeeded -- return body
      res.json(req.body);
    });
  });

};
