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
	  	res.send(trends);
	  }
	});
};