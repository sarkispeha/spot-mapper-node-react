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
	geoLocation : {
		'type':	{
			type: String,
			default: 'Point',
			index: true
		},
		coordinates: [Number] //long, lat
	},
	emailSent: String
});

module.exports = mongoose.model('friend', friendSchema);