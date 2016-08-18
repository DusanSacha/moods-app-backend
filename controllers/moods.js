var Mood = require('../models/Mood.js');
var StaticTrend = require('../models/StaticTrend.js');


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
	var yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);

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

	Mood.count(
		{	created:{"$gte": yesterday,"$lte": now},
			age:{"$in":age},
			gender:{"$in":gender},
			education:{"$in":education}
		},
		function(err, count) {
	 		if (err) {
		  		res.sendStatus(500);
		  		console.error(err);
		  	} else {
		  		var countAll = count;

	  		 	Mood.count(
	  		 		{	created:{"$gte": yesterday, "$lte": now},
	  		 			age:{"$in":age},
	  		 			gender:{"$in":gender},
	  		 			education:{"$in":education},
	  		 			hashtag: hashtag,
	  		 			mood:{"$in":[0,1,2,3,4,5]}
	  		 		},
	  		 		function(err, countNeg) {
				 		if (err) {
					  		res.sendStatus(500);
					  		console.error(err);
					  	} else {
					  		var percent_neg = Math.round(countNeg / (countAll / 100));
					  		(isNaN(percent_neg)) ? (percent_neg = 0) : null;

				  			Mood.count(
				  				{	created:{"$gte": yesterday, "$lte": now},
				  		 			age:{"$in":age},
				  		 			gender:{"$in":gender},
				  		 			education:{"$in":education},
				  		 			hashtag: hashtag,
				  		 			mood:{"$in":[6,7,8,9,10]}
	  		 					
				  			}, function(err, countPos) {
				  				if (err) {
					  				res.sendStatus(500);
					  				console.error(err);
					  			} else {
					  				var percent_pos = Math.round(countPos / (countAll / 100));
					  				(isNaN(percent_pos)) ? (percent_pos = 0) : null;

					  				res.send({hashtag: hashtag,
				  						percent_neg: percent_neg,
				  						percent_pos: percent_pos,
					  					age:age,
					  					gender:gender,
					  					education:education
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


function getObject(obj) {
	return new Promise(function (resolve, reject) {
        obj.count({}, function(err,count) {
             if(err) reject();
             else resolve(count);
        });
    });
};

exports.getTest = function(req,res) {
	Promise.all([getObject(Mood), getObject(StaticTrend)]).then(function success(result) {
		res.send({'count1':result[0],'count2':result[1]});
	});
	// Mood.count({},function(err,count){
	// 	res.send({count:count});
	// });

	// StaticTrend.count({},function(err,count){
	// 	res.send({count:count});
	// });
};