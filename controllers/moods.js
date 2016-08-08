var Mood = require('../models/Mood.js');

exports.sendMood = function(req,res) {
	
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
  	
};

exports.getPercentage = function(req,res) {
	var now = new Date();
	var yesterday = new Date(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate() - 1 ,
						now.getUTCHours(),now.getUTCMinutes() - now.getTimezoneOffset(),now.getUTCSeconds(),now.getUTCMilliseconds());	

	var hashtag = req.params.hash;
	var age = req.query.age;
	if (age === undefined) {
		age = [0,1,2,3,4,5,6];
	} else if (!(age instanceof Array)) {
		age = [parseInt(age)];
	}

	var gender = req.query.gender;
	if (gender === undefined) {
		gender = ["M","F","X"];
	} else if (!(gender instanceof Array)) {
		gender = [(gender)];
	}

	var education = req.query.education;
	if (education === undefined) {
		education = [0,1,2,3,4,5,6];
	} else if (!(education instanceof Array)) {
		education = [parseInt(education)];
	}

	Mood.count({created:{"$gte": yesterday, "$lte": now}, age:{"$in":age}, gender:{"$in":gender}, education:{"$in":education}}, function(err, count) {
	 		if (err) {
		  		res.sendStatus(500);
		  		console.error(err);
		  	} else {
		  		var countAll = count;

	  		 	Mood.count({created:{"$gte": yesterday, "$lte": now}, age:{"$in":age}, gender:{"$in":gender}, education:{"$in":education}, hashtag: hashtag}, function(err, countSingle) {
				 		if (err) {
					  		res.sendStatus(500);
					  		console.error(err);
					  	} else {
					  		var percentage = Math.round(countSingle / (countAll / 100));
					  		console.log(percentage+"test");
					  		(isNaN(percentage)) ? (percentage = 0) : null;
					  		res.send({hashtag: hashtag, percentage: percentage, age:age, gender:gender, education:education});	
					  	}
					}
				);

		  	}
		}
	);
};

exports.getPolygons = function(req,res) {

//TODO returns all geoJson polygons within screen parameter
// console.log(req.query.screen);
// var screens = req.query.screen;

// for (i = 0; i < screens.length; ++i) {
// 	screens[i]
// } 

// console.log(screen instanceof Array);
// res.sendStatus(200);
};