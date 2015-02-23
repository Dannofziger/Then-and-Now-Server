var model = require('../models/_____');
var eatAuth = require('eatAuth');
var bodyparser = require('body-parser');

module.exports = function(app, appSecret){
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