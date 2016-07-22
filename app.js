//Main app settings
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('port', (process.env.PORT || 5000));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

//Mongoose models
var StaticTrend = require('./models/StaticTrend.js');
var Mood = require('./models/Mood.js');

//Database Connection 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moods');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});

//Routes
app.get('/static_trends', function(req,res) {
	StaticTrend.find(function (err, trends) {
	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
	  	res.send(trends);	
	  }
	});
});

app.post('/moods', function(req,res) {
	
	req.body.ip = req.connection.remoteAddress;
	var mood = new Mood (req.body);

	mood.save(function(err, mood) {

	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
	  	res.sendStatus(200);	
	  }

	});
  	
});

app.get('/hashtag/:hash', function(req,res) {
	var now = new Date();
	var today = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
	var tomorrow = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1);
	Mood.count({created:{"$gte": today, "$lt": tomorrow}, hashtag: req.params.hash}, function(err, count) {
	 		if (err) {
		  		res.sendStatus(500);
		  		console.error(err);
		  	} else {
		  		res.send({count:count});	
		  	}
		}
	);
});

app.use(function(req,res) {
	res.sendStatus(404);
});

var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('Express server listening on port %s', port);
})
