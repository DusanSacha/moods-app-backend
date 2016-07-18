var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/moods', function(err, db){
	
	assert.equal(null, err);
	console.log("Successfully connected to server");

	app.get('/static_trends', function(req,res) {
		res.send(
			{
	    		"name" : "Präsidentenwahl",
	    		"trendlist" : [ 
	        		"wahlen2016", 
	        		"vanderbellen", 
	        		"norberthofer"
	    		]
			}
		);
	});

	app.post('/moods', function(req,res) {
		console.log("moods");
	});

	app.use(function(req,res) {
		res.sendStatus(404);
	});

	var server = app.listen(3000, function() {
		var port = server.address().port;
		console.log('Express server listening on port %s', port);
	})

});