var Polygon = require('../models/Polygon.js');

exports.getPolygons = function(req,res) {
	var type = req.body.type;
	var coordinates = req.body.coordinates;
	var screen = {
	    geometry: {
	       	$geoIntersects: {
	          	$geometry: {
	            	type: type ,
	             	coordinates: coordinates
	        	}
	       }
	    }
	};

	Polygon.find(screen,function (err, trends) {
	    if (err) {
	  		res.sendStatus(500);
	  		console.error(err);
	    } else {
	  		res.send(trends);
	    }
	});
};