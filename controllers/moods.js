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
			education:{"$in":education}
	};

	//find all moods data
	Mood.find(filter,
		function(err, resultAll) {
	 		if (err) {
		  		res.sendStatus(500);
		  		console.error(err);
		  	} else {
		  		//count value of all moods
		  		var countAll = 0;
		  		resultAll.forEach(function(mood) {
					countAll += MainController.getMoodValue(mood);
				});
		  		//find single mood data
		  		filter.hashtag = hashtag;
	  		 	Mood.find(filter,
	  		 		function(err, resultSingle) {
				 		if (err) {
					  		res.sendStatus(500);
					  		console.error(err);
					  	} else {

					  		//count value of single mood
					  		var countSingle = 0;
					  		resultSingle.forEach(function(mood) {
								countSingle += MainController.getMoodValue(mood);
							});

					  		//count percentage for single mood chart - number in the middle of the chart
					  		var percent_sum = Math.round(countSingle / (countAll / 100));
					  		(isNaN(percent_sum)) ? (percent_sum = 0) : null;

					  		//find negative values for a single mood chart
					  		filter.mood = {"$in":[0,1,2,3]};
				  			Mood.find(filter,
				  				function(err, resultNegative) {
				  				if (err) {
					  				res.sendStatus(500);
					  				console.error(err);
					  			} else {

					  				//count negative value of single mood
					  				var countNegative = 0;
							  		resultNegative.forEach(function(mood) {
										countNegative += MainController.getMoodValue(mood);
									});

							  		//count percentage of negative value for single mood
					  				var percent_neg = Math.round(countNegative / (countSingle / 100));
					  				(isNaN(percent_neg)) ? (percent_neg = 0) : null;

					  				//find positive values for a single mood chart
					  				filter.mood = {"$in":[7,8,9,10]};
					  				Mood.find(filter,
					  					function(err,resultPositive){
					  					if (err) {
					  						res.sendStatus(500);
					  						console.error(err);					  						
					  					} else {

					  				//count positive value of single mood
					  						var countPositive = 0;
									  		resultPositive.forEach(function(mood) {
												countPositive += MainController.getMoodValue(mood);
											});

							  		//count percentage of positive value for single mood
					  						var percent_pos = Math.round(countPositive / (countSingle / 100));
					  						(isNaN(percent_pos)) ? (percent_pos = 0) : null;

					  						res.send({hashtag: hashtag,
				  								percent_neg: percent_neg,
				  								percent_pos: percent_pos,
				  								percent_neu: 100 - percent_neg - percent_pos,
				  								percent_sum: percent_sum,
					  							age:age,
					  							gender:gender,
					  							education:education
					  		 				});						  						
					  					}
					  				});

					  				
					  			}
				  			});

					  		
					  	}
					}
				);

		  	}
		}
	);

};