var mongoose = require('mongoose');

var regionSchema = new mongoose.Schema({
  regionId: { type: Number, min: 0, max: 8},
  location: { type: {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} }
});

module.exports = mongoose.model('Region', regionSchema);