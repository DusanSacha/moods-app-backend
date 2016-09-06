/**
 * Polygons controller module.
 * @module controllers/polygons
 */

//required files
var MainController = require('./main.js');
var Polygon = require('../models/Polygon.js');
var Mood = require('../models/Mood.js');

//Function getPolygonData writes properties fill and fill-opacity to the polygon object
function getPolygonData(polygon,filter) {
	return new Promise(function(resolve, reject){

		filter.location = {
			$geoWithin: {
      			$geometry: {type: polygon.geometry.type, coordinates: polygon.geometry.coordinates}
   			}
   		};
   		console.log(filter);
		Mood.find(filter,function(err, moods){
   				if(err) {
   					reject();
   				} else {
   					//if there is a mood found within this polygon
   					//then count the average and send out the color paramters
   					if (moods.length) {
       					var sum = 0;
       					var divisor = 0;
       					moods.forEach(function(mood){
       						sum += MainController.getMoodValues(mood)[0];
       						divisor += MainController.getMoodValues(mood)[1];
       					});

       					var average = Math.round(sum / divisor);
       					(isNaN(average)) ? (average = 0) : null;

   						switch (true) {
       						case (average <= 4):
       							polygon.properties.fill = "#ff2600";  // red
       							break;
							case (average > 4 && average < 8 ):
       							polygon.properties.fill = "#c7c732"; // orange
       							break;
       						case (average >= 8 && average <= 11 ):
       							polygon.properties.fill = "#1fa305";  // green
       							break; 
       					}
       					polygon.properties["fill-opacity"] = 0.5;
		   			}

		   			polygon.properties["stroke-width"] = 0.5;
		   			
					resolve(polygon);
   				};
			}
		);
	});
}

//POST Method getPolygons called by /map router from app.js
exports.getPolygons = function(req,res) {
	var type = req.body.type;
	var coordinates = req.body.coordinates;
	var zoom = req.body.zoom;
	var age = req.body.age;
	var education = req.body.education;
	var gender = req.body.gender;
	var hashtag = req.body.hashtag;

	if (hashtag.length == 0) {
		hashtag[0] = "vanderbellen";
		hashtag[1] = "bpw16";
		hashtag[2] = "norberthofer";
	}

	var filter = {
		age:{"$in":age},
		gender:{"$in":gender},
		education:{"$in":education},
		hashtag:{"$in":hashtag}
	};

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
  		  		promises.push(getPolygonData(polygons[i],filter));
  			}

	    	Promise.all(promises).then(function (result){
	    		var geoJsonCollection = {
	    			 "type": "FeatureCollection",
  					 "features": result
	    		};

	    		res.send(geoJsonCollection);
	    	}).catch(function(err) {
  				console.log(err.message);
			});	  		 
	    }
	});
};