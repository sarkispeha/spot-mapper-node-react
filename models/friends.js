var mongoose = require('mongoose');

var friendSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	address: String,
	city: String,
	zip: Number,
	state: String,
	country: String,
	lat: Number,
	long: Number
});

module.exports = mongoose.model('friend', friendSchema);