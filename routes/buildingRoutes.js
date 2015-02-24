'use strict';

var bodyparser = require('body-parser');
var Building = require('../models/Building');


module.exports = function(app){
  app.use(bodyparser.json());

  app.get('', function(req, res){
    model.find({}, function(err, data){
      if(err) return res.status(500).send({msg: 'could not retrieve data'});

      res.join(data);
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

  app.put('', function(req, res){

  });
  app.patch('', function(req, res){

  });
  app.delete('', function(req, res){

  });
};
