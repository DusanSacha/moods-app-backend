var mongoose = require('mongoose');

var moodSchema = new mongoose.Schema({
  mood: { type: Number, min: 0, max: 10 },
  hashtag: String,
  location: { type: {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number],   default: [0,0]} },
  ip: String,
  age: { type: Number, min: 0, max: 99 },
  gender: {type: String, enum: ["M","F"]},
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Mood', moodSchema);