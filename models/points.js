var mongoose = require('mongoose');

var pointSchema = mongoose.Schema({
	message_id: Number,
	lat: Number,
	long: Number,
	created_at_unix : Number,
	created_at_formatted: String
	// created_at: String
});

module.exports = mongoose.model('point', pointSchema);