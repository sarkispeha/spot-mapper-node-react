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
			default: 'Point'
		},
		coordinates: [Number] //long, lat
	},
	emailSent: {type: Array, default: [2016, 8, 21]}
});

module.exports = mongoose.model('friend', friendSchema);