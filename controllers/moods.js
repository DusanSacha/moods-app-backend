/**
 * Moods controller module.
 * @module controllers/moods
 */

//required files
var MainController = require('./main.js');
var Mood = require('../models/Mood.js');
var Region = require('../models/Region.js');
var StaticTrend = require('../models/StaticTrend.js');

/** Send Mood 
*	
*/
exports.sendMood = function(req,res) {
	req.body.ip = req.connection.remoteAddress;
	var mood = new Mood (req.body);

	if (req.body.location === undefined) {

		if (mood.region > 9) {
			mood.region = 0;	
		}

		var region = mood.region;

		Region.findOne({regionId:region}
			,function(err,location){
				if (err) {
		  			res.sendStatus(500);
		  			console.error(err);
		  		} else {
		  	 		mood.location = location.location;
		  			mood.save(function(err, mood) {

						if (err) {
						  res.sendStatus(500);
						  console.error(err);
						} else {
						  res.sendStatus(200);	
						}

					});	
		  		}
			});

	} else {

		mood.save(function(err, mood) {

		  if (err) {
		  	res.sendStatus(500);
		  	console.error(err);
		  } else {
		  	res.sendStatus(200);	
		  }

		});
	}
  	
};

exports.getPercentage = function(req,res) {
	var now = new Date();
	var yesterday = new Date();
	yesterday.setDate(now.getDate() - 30);

	var hashtag = req.params.hash;
	var age = req.query.a;
	if (age === undefined) {
		age = [];
	} else if (!(age instanceof Array)) {
		age = [parseInt(age)];
	}

	var gender = req.query.g;
	if (gender === undefined) {
		gender = [];
	} else if (!(gender instanceof Array)) {
		gender = [(gender)];
	}

	var education = req.query.e;
	if (education === undefined) {
		education = [];
	} else if (!(education instanceof Array)) {
		education = [parseInt(education)];
	}

	var filter = {
			created:{"$gte": yesterday,"$lte": now},
			age:{"$in":age},
			gender:{"$in":gender},
			education:{"$in":education},
			hashtag: hashtag
	};

	//find all moods data
	Mood.find(filter,
		function(err, result) {
	 		if (err) {
		  		res.sendStatus(500);
		  		console.error(err);
		  	} else {
		  		
		  		var count = 0;
		  		var divisor = 0;
		  		result.forEach(function(mood) {
					count += MainController.getMoodValues(mood)[0];
					divisor += MainController.getMoodValues(mood)[1];
				});

		  		var average_mood = count / divisor;
		  		(isNaN(average_mood)) ? (average_mood = 0) : null;

		  		res.send({
			  		hashtag: hashtag,
			  		average_mood: average_mood,
					age:age,
					gender:gender,
					education:education
	 			});	

		  	}
		}
	);

};