var express = require('express');
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser'); //important for reading request parameters
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.set('port', (process.env.PORT || 5000)); //port check: 5000 = localhost
app.set('etag', false);  //disable 304 Status code
//allowing OPTIONS method
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

//Controllers definition
var staticController = require('./controllers/static');
var moodsController = require('./controllers/moods');
var polygonsController = require('./controllers/polygons');
var newslettersController = require('./controllers/newsletters');

//Database Connection 
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moods');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected")
});


//Routes
app.get('/static_trends', staticController.staticData);
app.post('/moods', moodsController.sendMood);
app.get('/hashtag/:hash', moodsController.getPercentage);
app.post('/map', polygonsController.getPolygons);
app.post('/newsletter', newslettersController.saveNewsletter);
app.get('/newsletter', newslettersController.getNewsletter);

app.use(function(req,res) {
	res.sendStatus(404);
});

//server starting
var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('Express server listening on port %s', port);
})

