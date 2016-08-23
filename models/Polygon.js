var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');

var polygonSchema = new mongoose.Schema({
	type: String,
	zoom: String,
	properties : {
		title: String,
		name: String,
		fill: String,
		opacity: String
	},
	geometry: mongoose.Schema.Types.Polygon
});

module.exports = mongoose.model('Polygon', polygonSchema);