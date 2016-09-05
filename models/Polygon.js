var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var polygonSchema = new mongoose.Schema({
	type: String,
	zoom: String,
	properties : {
		title: String,
		name: String,
		fill: String,
		"fill-opacity": Number,
		"stroke-width": Number
	},
	geometry: mongoose.Schema.Types.GeoJSON
});

module.exports = mongoose.model('Polygon', polygonSchema);