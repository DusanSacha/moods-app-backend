/**
 * StaticTrend controller module.
 * @module controllers/static
 */
var StaticTrend = require('../models/StaticTrend.js');

exports.staticData = function(req,res) {
	StaticTrend.find(function (err, trends) {
	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
    /*
      trends.trendlistCount = [];
      trends.trendlist.forEach(function(sHashtag) {
        trends.trendlistCount.push([sHashtag,"234"]);    
			});
      */
      console.error(trends);
      
	  	res.send(trends);
	  }
	});
};