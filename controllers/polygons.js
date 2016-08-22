var Polygon = require('../models/Polygon.js');

exports.getPolygons = function(req,res) {
	var type = req.body.type;
	var coordinates = req.body.coordinates;
	var zoom = req.body.zoom;
	var screen = {
	    geometry: {
	       	$geoIntersects: {
	          	$geometry: {
	            	type: type,
	             	coordinates: coordinates,
	        	}
	        }
	    },
	    zoom:zoom
	};

	Polygon.find(screen,function (err, polygons) {
	    if (err) {
	  		res.sendStatus(500);
	  		console.error(err);
	    } else {
	    	
	  		res.send(polygons);

	  		for (var i = 0; i >= polygons.length; i++) {
				
				Mood.find({
					//geowithin
					//paramteres req.body.age....

				});

				//udelat prumer ze vsech moods hodnot
				//podle toho rozhodnout jakou barvu poslat
				//"properties": {
      			//"title": "Wien" //schon da
      			//"fill": #f0f0f0,
      			//"fill-opacity": 0.5,
				//},
	  		 }; 

	    }
	});
};