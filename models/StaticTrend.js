var mongoose = require('mongoose');

var staticTrendSchema = new mongoose.Schema({
  name: String, 
  trendlist: [String],
  moodCountTxt: String
});

module.exports = mongoose.model('StaticTrend', staticTrendSchema);