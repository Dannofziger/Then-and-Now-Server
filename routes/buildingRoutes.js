'use strict';

var bodyparser = require('body-parser');
var Building = require('../models/Building');


module.exports = function(app){
  app.use(bodyparser.json());

  // request to get all the buildings from the database
  app.get('/building', function(req, res) {
    // .find() is mongoose static method on the "class" Building

    console.log("in buildingRoutes.js about to call Building.find()");
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
      console.log(data);
      console.dir(data);

      // success - return array of all the platypuses to the client
      res.json(data);
    });
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
  app.delete('', function(req, res){

  });
};
