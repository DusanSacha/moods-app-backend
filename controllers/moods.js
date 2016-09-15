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
exports.sendMood = function(req, res) {
	var iMin = 2;
	var sActionText = "";
	req.body.ip = req.connection.remoteAddress;
	var mood = new Mood(req.body);

	StaticTrend.count({
			"hashtag": mood.hashtag
		}).then(function(result) {})
		.catch(function(result) {
			mood.hashtag = "HACK " + mood.hashtag;
		});

	var dNow = new Date();
	var dLastMood = new Date(dNow.getTime() - (iMin * 60000));
console.log(mood.ip);
	//find({day: {$lt: 16085}}).sort({day: -1}).limit(1).exec((err, docs) => { ... });
	Mood.find({
			$and: [{
				$or: [{
					"ip": mood.ip
				}, {
					"user": mood.user
				}]
			}, {
				"hashtag": mood.hashtag
			}, {
				"created": {
					$gt: dLastMood.getTime()
				}
			}]
		})
		.sort({
			created: -1
		}).limit(1)
		.then(function(result) {
			sCreated = result[0].created;
			dCreated = new Date(sCreated);
			dDiff = new Date(dNow - dCreated);
			console.log(dLastMood);
			console.log(sCreated);
			console.log(dNow);
			idiff = iMin - dDiff.getMinutes();
			if (idiff === 0) {
				idiff = 60 - dDiff.getSeconds();
				sFastText = idiff + " Sekunden ";
			} else {
				sFastText = idiff + " Minuten ";
			}

			sActionText = "<center>Uuups, zu schnell gemooded.<br />Um Manipulationen zu vermeiden, kannst du<br /><b>#" + mood.hashtag + "</b><br />" +
                    "erst in <b>" + sFastText +	"</b>wieder mooden</center>";
			res.status(429).send(sActionText);
			console.log("Ups");
			return;
		})
		.catch(function() {
			console.log("Save");
			if (typeof req.body.location === "undefined") {
				if (mood.region > 9) {
					mood.region = 0;
				}

				var region = mood.region;

				Region.findOne({
					regionId: region
				}, function(err, location) {
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
								res.status(201).send(sActionText);
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
						res.status(201).send(sActionText);
					}

				});
			}
		});

};

exports.getPercentage = function(req, res) {
	var now = new Date();
	var pastDate = new Date();
	pastDate.setDate(now.getDate() - 30);
	var age = req.query.a;
	var education = req.query.e;
	var gender = req.query.g;
	var hashtag = req.params.hash;

	console.log(req.headers);
	var filter = {
		created: {
			"$gte": pastDate,
			"$lte": now
		},
		hashtag: hashtag
	};

	if (age === undefined) {
		age = [];
	} else if (!(age instanceof Array)) {
		age = [parseInt(age)];
		filter.age = {
			"$in": age
		};
	} else {
		filter.age = {
			"$in": age
		};
	}

	if (gender === undefined) {
		gender = [];
	} else if (!(gender instanceof Array)) {
		gender = [(gender)];
		filter.gender = {
			"$in": gender
		};
	} else {
		filter.gender = {
			"$in": gender
		};
	}

	if (education === undefined) {
		education = [];
	} else if (!(education instanceof Array)) {
		education = [parseInt(education)];
		filter.education = {
			"$in": education
		};
	} else {
		filter.education = {
			"$in": education
		};
	}

	//get count of all Moods
	var sOverallCount = "";
	var sCount = "";
	Mood.count({
		"hashtag": hashtag
	}).exec().then(function(count) {
		sOverallCount = MainController.getCountText(count)
	});
	//find all moods data
	Mood.find(filter,
		function(err, result) {
			if (err) {
				res.sendStatus(500);
				console.error(err);
			} else {
				sCount = result.length;
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
					age: age,
					gender: gender,
					education: education,
					moodCountTxt: MainController.getCountText(sCount),
					moodCountTotalTxt: sOverallCount
				});

			}
		}
	);

};