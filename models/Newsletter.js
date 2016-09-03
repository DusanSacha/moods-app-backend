var mongoose = require('mongoose');

var date = new Date();

var newsletterSchema = new mongoose.Schema({
  email: { type: String, minlength: 1, maxlength: 255, required: true },
  firstName: String,
  lastName: String,
  created: { type: Date, default: date }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);