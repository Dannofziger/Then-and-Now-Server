'use strict';

var Building = require('../models/Building');
//var url = require('url');
//var queryString = require('querystring');
//var distance = require('../lib/calc_dist_btwn_two_pts_long_lat');
var bodyparser = require('body-parser');

module.exports = function(app){
  app.use(bodyparser.json());

  app.get('/building', function(req, res){
    console.log('req: '+ JSON.stringify(req.body));
    var type = req.body.gettype;
    if(type === 'tags'){
      var tagArr = req.body.tagsArray;
      var tagArray = [];
      for(var i = 0; i < tagArr.length; i++){
        tagArray[i] = tagArr[i].tag.toLowerCase();
      };
      console.log(tagArray);
      Building.find({})
        .where({'tags':{
          $in: tagArray
        }})
        .exec(function(err, data){
          if(err) return res.status(500).send({msg: 'could not get data'});
          console.log(data);
          res.json(data);
        });
    }else if(type === 'rectangleSearch'){
      var ULLon = req.body.upperLeftLong;
      var ULLat = req.body.upperLeftLat;
      var LRLon = req.body.lowerRightLong;
      var LRLat = req.body.lowerRightLat;
      Building.find({ loc:
       { $geoWithin :
         { $geometry:
           { type : "Polygon",
             coordinates : [ [ 
              [ULLon, ULLat],
              [ULLon, LRLat],
              [LRLon, LRLat],
              [LRLon, ULLat],
              [ULLon, ULLat]  ] ]
            }
          }
        }
      }, function(err, data){
      if(err) return res.status(500).send({msg: 'could not get data'});
      res.json(data);
     })
    }
  });
//  app.put();
  app.post('/building', function(req, res){
    var newBuilding = new Building(req.body).
    newBuilding.save(function(err, data){
      if(err) return res.status(500).send({msg: 'could not write data'});
      res.json(data);
    });
  });
//  app.patch();
//  app.delete();
};
/*
module.exports = function(app){

  // request to get all the buildings from the database
  app.get('/building', function(req, res) {
    console.log("in buildingRoutes.js  app.get()");
    //console.dir(req);

    // get the values of the parameters from the Request url
    //localhost:3000/api/v1/building?gettype=invicinitycircle&radius=.025&long=-122.348905&lat=47.6205535 get

    console.log("req.url");
    console.log(req.url);
    var params = url.parse(req.url).query;
    console.log("url.parse(req.url).query");
    console.log(params);

    var getType = queryString.parse(params)["gettype"];
    console.log("getType = " + getType);

    if (getType === "invicinitycircle") {

     //localhost:3000/api/v1/building?gettype=invicinitycircle&radius=.025&long=-122.348905&lat=47.6205535 get

      var vicinityRadius = queryString.parse(params)["radius"]; // in miles
      console.log("vicinityRadius = " + vicinityRadius);
      var reqLong = queryString.parse(params)["long"];
      var reqLat = queryString.parse(params)["lat"];

     // reqLat = 47.6205535 get      remove "get"
      var substrReqLat = reqLat.substring(0, reqLat.length - 4);
      console.log("reqLat substring = " + substrReqLat);
      console.log("param reqLong = " + reqLong);
      console.log("param reqLat = "  + reqLat);

      // don't forget do create the index
      //     db.buildings.ensureIndex({ loc : "2dsphere" });

      console.log("get all buildings in a circle");
      // find all buildings within a certain radius in the database
      // http://docs.mongodb.org/manual/reference/operator/query/centerSphere/
      var radiusEarth = 3959;  // radius in miles

      Building.find( { loc: {
                       $geoWithin: {
                         $centerSphere: [ [ parseFloat(reqLong),
                                            parseFloat(reqLat) ],
                                          vicinityRadius/radiusEarth ]
                       }
                     }}, function(err, data) {
        // find failed
        if (err) {
          console.log("in buildingRoutes.js  app.get() Building.find err = " + err);
          return res.status(500).send({'msg': 'could not retrieve buildings'});
        }
        console.log("success in Building.find()");
        console.log("data");
        //console.log(data);
        //console.dir(data);

        res.json(data);
      });

    } else if (getType === "invicinityrectangle") {

      //localhost:3000/api/v1/building?gettype=invicinityrectangle&radius=.025&long1=-122.348905&lat1=47.6205535&long2=-121.348905&lat2=46.6205535 get
      var long1 = queryString.parse(params)["long1"];
      var lat1  = queryString.parse(params)["lat1"];
      var long2 = queryString.parse(params)["long2"];
      var lat2  = queryString.parse(params)["lat2"];

      // reqLat = 47.6205535 get      remove "get"
      var substrlat2 = lat2.substring(0, lat2.length - 4);
      //lat2 = substrlat2;

      console.log("long1 = " + long1);
      console.log("lat1 = "  + lat1);
      console.log("long2 = " + long2);
      console.log("lat2 = "  + lat2);

      var flLong1 = parseFloat(long1);
      var flLat1  = parseFloat(lat1);
      var flLong2 = parseFloat(long2);
      var flLat2  = parseFloat(lat2);


      console.log("get all buildings in a rectangle");

      // don't forget do create the index
      //     db.buildings.ensureIndex({ loc : "2dsphere" });

// db.places.find( { loc :
//                   { $geoWithin :
//                     { $geometry :
//                       { type : "Polygon",
//                         coordinates : [ [ [ 0 , 0 ] , [ 0 , 1 ] , [ 1 , 1 ] , [ 1 , 0 ] , [ 0 , 0 ] ] ]
//                 } } } } )

      // returns points only (not the rest of the data ??)
      Building.find( { loc:
                       { $geoWithin :
                         { $geometry:
                           { type : "Polygon",
                             coordinates : [ [ [flLong1, flLat1],
                                   [flLong1, flLat2],
                                   [flLong2, flLat2],
                                   [flLong2, flLat1],
                                   [flLong1, flLat1]  ] ]
                           }
                          }
                        }
                     }, function(err, data) {

        // find failed
        if (err) {
          console.log("in buildingRoutes.js  app.get() Building.find err = " + err);
          return res.status(500).send({'msg': 'could not retrieve buildings'});
        }
        console.log("success in Building.find()");
        console.log("data");
        //console.log(data);
        //console.dir(data);

        console.log("returned count = " + data.length);

        res.json(data);

      });

    } else if (getType === 'searchtags') {

      //localhost:3000/api/v1/building?gettype=searchtags&tag=Tower get
      var tag = queryString.parse(params)["tag"];

      console.log("request tag = " + tag);
      console.log("search tags for buildings in the database");

      Building.find( {tags: tag}, function(err, data) {
        // find failed
        if (err) {
          console.log("in buildingRoutes.js  app.get() Building.find err = " + err);
          return res.status(500).send({'msg': 'could not retrieve buildings'});
        }
        console.log("success in Building.find()");
        console.log("data");
        //console.log(data);
        //console.dir(data);
        console.log("count = " + data.length);

        for (var i = 0; i < data.length ; i++) {
          console.log("building number in search results = " + i);
          console.log(data[i].tags);
        }
        res.json(data);
      });

    } else {
      // return all buildings
      console.log("get all buildings in the database");

      Building.find( {}, function(err, data) {
        // find failed
        if (err) {
          console.log("in buildingRoutes.js  app.get() Building.find err = " + err);
          return res.status(500).send({'msg': 'could not retrieve buildings'});
        }
        console.log("success in Building.find()");
        console.log("data");
        //console.log(data);
        //console.dir(data);
        console.log("count = " + data.length);

        res.json(data);
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
*/