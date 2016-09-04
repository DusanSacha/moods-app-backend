/**
 * Newsletter controller module.
 * @module controllers/newsletters
 */

var Newsletter = require('../models/Newsletter.js');

exports.saveNewsletter = function(req,res) {
	
	var newsletter = new Newsletter(req.body);

	newsletter.save(function (err, newsletter) {
	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
	  	res.sendStatus(200);
	  }
	});
};

exports.getNewsletter = function(req,res) {

	Newsletter.find(function (err, subscribers) {
	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
	  	res.send(subscribers);
	  }
	});
};