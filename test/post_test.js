'use strict';

process.env.MONGO_URI = 'mongodb://localhost/tanapp_test';
require('../server.js');
var mongoose = require('mongoose');
var chai     = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var expect = chai.expect;

describe('then-and-now api end points', function() {
  before(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should respond to a post request', function(done) {
    chai.request('localhost:3000/api/v1')
        .post('/building')
        .send({buildingName: 'Taj Mahal',
               loc : { type: "Point", coordinates: [ -122.330547, 47.604886 ] }
})
        .end(function(err, res) {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('_id');
          expect(res.body.buildingName).to.eql('Taj Mahal');
          expect(res.body.loc.coordinates[0]).to.eql(-122.330547);
          expect(res.body.loc.coordinates[1]).to.eql(47.604886);
          done();
        });
  });
});
