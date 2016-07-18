var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
	
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

var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('Express server listening on port %s', port);
})
