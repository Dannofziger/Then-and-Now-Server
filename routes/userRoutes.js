'use strict';

var bodyparser = require('body-parser');
var User = require('../models/User');


module.exports = function(app){
	app.use(bodyparser.json());

	app.get('', function(req, res){
		model.find({}, function(err, data){
			if(err) return res.status(500).send({msg: 'could not retrieve data'});

			res.join(data);
		});
	});
	app.post('', function(req, res){

	});
	app.put('', function(req, res){

	});
	app.patch('', function(req, res){

	});
	app.delete('', function(req, res){

	});
};
