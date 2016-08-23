var Polygon = require('../models/Polygon.js');
var Mood = require('../models/Mood.js');

function getPolygonData(polygon) {
	return new Promise(function(resolve, reject){
		Mood.find({location: {
				$geoWithin: {
      				$geometry: {type: polygon.geometry.type, coordinates: polygon.geometry.coordinates}
   				}
   				}},function(err, moods){
   				if(err) {
   					reject();
   				} else {

   					//if there is a mood found within this polygon
   					//then count the average and send out the color paramters
   					if (moods.length) {
       					var sum = 0;
       					moods.forEach(function(mood){
       						sum += mood.mood;
       					});
       					var average = Math.round(sum / moods.length);

       					switch (true) {
       						case (average <= 3):
       							polygon.properties.fill = "#ff2600"; 
       							break;
							case (average > 3 && average < 7 ):
       							polygon.properties.fill = "#c7c732"; 
       							break;
       						case (average >= 7 && average <= 10 ):
       							polygon.properties.fill = "#1fa305"; 
       							break; 
       					}
       					polygon.properties.opacity = "0.5";
						      					
		   			}
					resolve(polygon);
   				};
			}
		);
	});
}

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
    		
    		var promises = [];
    		for (var i in polygons) {
  		  		promises.push(getPolygonData(polygons[i]));
  			}

	    	Promise.all(promises).then(function (result){
	    		res.send(result);
	    	});	  		 
	    }
	});
};