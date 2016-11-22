/**
 * StaticTrend controller module.
 * @module controllers/static
 */
var MainController = require('./main.js'); 
var StaticTrend = require('../models/StaticTrend.js');
var Mood = require('../models/Mood.js');

exports.staticData = function(req,res) {
  var oTrends = null;
	StaticTrend.find(function (err, trends) {
	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
      oTrends = trends[0].toObject();
      oTrends.trendlistCount = [];
      var aPromises = [];
      oTrends.trendlist.forEach(function(sHashtag) {
        	aPromises.push(Mood.count({"hashtag": sHashtag}).exec());
			});
	    	Promise.all(aPromises).then(function (result){
          oTrends.trendlist.forEach(function(sHashtag,iIndex) {
            oTrends.trendlistCount.push([sHashtag,result[iIndex],MainController.getCountText(result[iIndex])]);
			    });
          res.send(oTrends);
	    	})
        .catch(function(err) {
  			   console.log(err.message);
			  });
	  }
	});
};

exports.staticDataDev = function(req,res) {
  var oTrends = null;
  var aTrendsRes = [];
	StaticTrend.find(function (err, trends) {
	  if (err) {
	  	res.sendStatus(500);
	  	console.error(err);
	  } else {
	  	  
	  	  trends.forEach(function(oTrend) {
	  	  	var oNewTrend = oTrend.toObject(); 
			console.log(oNewTrend);
	  	  	oNewTrend.trendlistCount = [[oNewTrend.trendlist[0],"101","101 Moods"],[oNewTrend.trendlist[1],"72","72 Moods"],[oNewTrend.trendlist[2],"62","62 Moods"]];
	  	  	aTrendsRes.push(oNewTrend);
	  	  	
	  	  });
	  	  res.send(aTrendsRes);

	   //    oTrends = trends[0].toObject();
	   //    oTrends.trendlistCount = [];
	      
	   //    var aPromises = [];

	   //    oTrends.trendlist.forEach(function(sHashtag) {
	   //      	aPromises.push(Mood.count({"hashtag": sHashtag}).exec());
		  // });

		  // Promise.all(aPromises).then(function (result){
		  //     oTrends.trendlist.forEach(function(sHashtag,iIndex) {
		  //       oTrends.trendlistCount.push([sHashtag,result[iIndex],MainController.getCountText(result[iIndex])]);
				//     });
		  //     res.send(oTrends);
		  // }).catch(function(err) {
	  	// 		   console.log(err.message);
		  // });
	  }
	});
};