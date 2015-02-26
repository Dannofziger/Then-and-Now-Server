'use strict';

var Building = require('../models/Building');
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
  app.patch('/building', function(req, res){
    var id = req.body.id;
    var newData = req.body.newData;
    Building.find({})
      .where({_id: id})
      .update(newData);
  });
  app.delete('/building', function(req, res){
    var id = req.body.id;
    Building.remove({_id: id}, function(err){
      if(err) return res.status(500).send({msg: 'Delete failed'});
      res.json({msg: 'Building '+id+' deleted sucessfully'});
    });
  });
};