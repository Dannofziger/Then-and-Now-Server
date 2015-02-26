'use strict';

process.env.MONGO_URI = 'mongodb://localhost/tanapp_test';
require('../server.js');
var mongoose = require('mongoose');
var chai     = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;

describe('building api end points', function() {
  before(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  describe('already has data in database', function() {
    var id3, id4;
    before(function(done){
      chai.request('localhost:3000/api/v1')
        .post('/building')
        .send({loc : { type: "Point", coordinates: [ -122.335645, 47.607152 ] },
               buildingName: 'Eiffel Tower'})
        .end(function(err, res){
          id3 = res.body._id;
          chai.request('localhost:3000/api/v1')
              .post('/building')
              .send({loc : { type: "Point", coordinates: [ -122.335645, 47.607152 ] },
                    buildingName: 'Winsor Castle'})
              .end(function(err, res){
                id4 = res.body._id;
                done();
              });
        });
    });

    //localhost:3000/api/v1/building?gettype=invicinityrectangle&radius=.025&long1=-122.348905&lat1=47.6205535&long2=-121.348905&lat2=46.6205535 get

    it('should get buildings in the rectangle from the db', function(done) {
      chai.request('localhost:3000/api/v1')
        .get('/building?gettype=invicinityrectangle&radius=.025&long1=-122.348905&lat1=47.6205535&long2=-121.348905&lat2=46.6205535')
        .end(function(err, res){
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.be.true;
          expect(res.body[0]).to.have.property('buildingName');
          expect(res.body.length).to.eql(2);
          done();
        });
    });

  });
});
