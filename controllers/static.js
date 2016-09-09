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
      trends[0].trendlistCount = [];
      trends[0].trendlist.forEach(function(sHashtag) {
        trends[0].trendlistCount.push([sHashtag,"123"]);    
			});
      console.log("trends");
      console.log(trends[0]);
      console.log(typeof trends);
      console.log(typeof trends[0]);
      //array of Objects
	  	res.send(trends);
	  }
	});
};