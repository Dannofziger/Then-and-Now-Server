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
    var id2;
    before(function(done){
      chai.request('localhost:3000/api/v1')
        .post('/building')
        .send({buildingName: 'Space Needle'})
        .end(function(err, res){
          id2 = res.body._id;
          done();
        });

    });

    it('should be able to delete a building', function(done) {
      chai.request('localhost:3000/api/v1')
        .del('/building/' + id2)
        .end(function(err, res) {
          console.log("delete test id2");
          console.log(id2);
          expect(err).to.eql(null);
          done();
        });
    });

  });
});
