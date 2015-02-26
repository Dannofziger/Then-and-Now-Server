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
    var id;
    before(function(done){
      chai.request('localhost:3000/api/v1')
        .post('/building')
        .send({buildingName: 'White House'})
        .end(function(err, res){
          id = res.body._id;
          done();
        });
    });

    //localhost:3000/api/v1/building?gettype=invicinityrectangle&radius=.025&long1=-122.348905&lat1=47.6205535&long2=-121.348905&lat2=46.6205535 get

    it('should be able to update a building', function(done) {
      chai.request('localhost:3000/api/v1')
        .put('/building/' + id)
        .send({buildingName: 'Taj Mahal'})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body.buildingName).to.eql('Taj Mahal');
          done();
        });
    });

  });
});
