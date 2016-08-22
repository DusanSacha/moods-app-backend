var Mood = require('../models/Mood.js');
var Region = require('../models/Region.js');
var StaticTrend = require('../models/StaticTrend.js');


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
	yesterday.setDate(now.getDate() - 1);

	var hashtag = req.params.hash;
	var age = req.query.a;
	if (age === undefined) {
		age = [0,1,2,3,4,5,6,7];
	} else if (!(age instanceof Array)) {
		age = [parseInt(age)];
	}

	var gender = req.query.g;
	if (gender === undefined) {
		gender = ["M","F","X"];
	} else if (!(gender instanceof Array)) {
		gender = [(gender)];
	}

	var education = req.query.e;
	if (education === undefined) {
		education = [0,1,2,3,4,5];
	} else if (!(education instanceof Array)) {
		education = [parseInt(education)];
	}

	var filter = {
			created:{"$gte": yesterday,"$lte": now},
			age:{"$in":age},
			gender:{"$in":gender},
			education:{"$in":education}
		};

	Mood.count(filter,
		function(err, countAll) {
	 		if (err) {
		  		res.sendStatus(500);
		  		console.error(err);
		  	} else {
		  		filter.hashtag = hashtag;
	  		 	Mood.count(filter,
	  		 		function(err, countSingle) {
				 		if (err) {
					  		res.sendStatus(500);
					  		console.error(err);
					  	} else {
					  		var percent_sum = Math.round(countSingle / (countAll / 100));
					  		(isNaN(percent_sum)) ? (percent_sum = 0) : null;

					  		filter.mood = {"$in":[0,1,2,3]};
				  			Mood.count(filter,
				  				function(err, countNegative) {
				  				if (err) {
					  				res.sendStatus(500);
					  				console.error(err);
					  			} else {
					  				var percent_neg = Math.round(countNegative / (countSingle / 100));
					  				(isNaN(percent_neg)) ? (percent_neg = 0) : null;

					  				filter.mood = {"$in":[7,8,9,10]};
					  				Mood.count (filter,
					  					function(err,countPositive){
					  					if (err) {
					  						res.sendStatus(500);
					  						console.error(err);					  						
					  					} else {
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