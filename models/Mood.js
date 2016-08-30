var mongoose = require('mongoose');

var moodSchema = new mongoose.Schema({
  mood: { type: Number, min: 1, max: 11 },
  hashtag: String,
  location: { type: {type: String, enum: "Point", default: "Point"}, coordinates: { type: [Number], default: [0,0]} },
  ip: String,
  age: { type: Number, min: 0, max: 7, default: 0 },
  gender: { type: String, enum: ["M","F","X"], default: "X" },
  education: { type: Number, min: 0, max: 5, default: 0 },
  created: { type: Date, default: Date.now },
  user: String,
  region: { type: Number, min: 0, max: 9, default: 0 }
});

module.exports = mongoose.model('Mood', moodSchema);