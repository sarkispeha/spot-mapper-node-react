
const request = require('request');
const Point = require('../models/points.js');
const mongoose = require('mongoose');
var config = require('../config')

mongoose.connect(config.database);

var getPoints = () => {
	console.log('WORKER IS FIRING TO SPOT API', new Date());
	request.get('https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0qyLXAX1l0neorapAYdqS0pnuDtThqtS4/latest.json', function(error, response, body){
		// console.log('this is the body from first request', body);
		var parsedBody = JSON.parse(body)
		var messageId = parsedBody.response.feedMessageResponse.messages.message.id;
		var latitude = parsedBody.response.feedMessageResponse.messages.message.latitude;
		var longitude = parsedBody.response.feedMessageResponse.messages.message.longitude;
		var created_at = parsedBody.response.feedMessageResponse.messages.message.dateTime.split('').splice(0,19).join('');
		console.log('FROM WORKER: POINT ID', messageId);
		console.log('lat: ', latitude, 'long :', longitude, 'created_at :', created_at)
		//find one and update the previous point if not new
		Point.findOneAndUpdate(
			{message_id: messageId},
			{message_id: messageId, long: longitude, lat: latitude, created_at : created_at},
			{upsert: true, new: true}
		).exec()
	})
		// var newPoint = new Point();
		// newPoint.lat = latitude;
		// newPoint.long = longitude;
		// newPoint.save(function(err, result){
		// 	console.log('this is the save to db err: ', err);
		// })
}

setInterval(function() {
	getPoints();
}, 180000);

getPoints();