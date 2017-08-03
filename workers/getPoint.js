'use strict'
const request = require('request');
const moment = require('moment');
const Point = require('../models/points.js');
const Friend = require('../models/friends.js');
const mongoose = require('mongoose');
var config = require('../config')

mongoose.connect(config.database);

var getPoints = () => {
	console.log('WORKER IS FIRING TO SPOT API', new Date());
	request.get('https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0qyLXAX1l0neorapAYdqS0pnuDtThqtS4/latest.json', function(error, response, body){
		// console.log('this is the body from first request', body);
		var parsedBody = JSON.parse(body)
		if(parsedBody.response){

			var messageId = parsedBody.response.feedMessageResponse.messages.message.id;
			var latitude = parsedBody.response.feedMessageResponse.messages.message.latitude;
			var longitude = parsedBody.response.feedMessageResponse.messages.message.longitude;
			// var created_at = parsedBody.response.feedMessageResponse.messages.message.dateTime.split('').splice(0,19).join('');
			var createdAtUnix = moment(parsedBody.response.feedMessageResponse.messages.message.dateTime).unix()
			var createdAtFormatted = moment(parsedBody.response.feedMessageResponse.messages.message.dateTime).format('L LTS');
			console.log('MOMENT PARSE', moment(parsedBody.response.feedMessageResponse.messages.message.dateTime).format('L LTS') )
			console.log('MOMENT PARSE 2', moment(parsedBody.response.feedMessageResponse.messages.message.dateTime).unix() )
			console.log('FROM WORKER: POINT ID', messageId);
			console.log('lat: ', latitude, 'long :', longitude, 'created_at :', createdAtFormatted)

			// find one and update the previous point if not new
			Point.findOneAndUpdate(
				{message_id: messageId},
				{message_id: messageId, long: longitude, lat: latitude, created_at_unix : createdAtUnix, created_at_formatted: createdAtFormatted},
				{upsert: true, new: true}
			).exec()
		}else{
			console.log('NO POINT TO GET');
		}

		///START FRIEND NEAR TEST

		// Point.find({message_id: messageId}
		// 	, function(err, results){
		// 		console.log('the results of the find', results)
		// 		if(results.length == 0 || results[0].message_id !== messageId){
		// 			//request an API route that will hit the socket.io
		// 			let postOptions = {
		// 				url: urlOrigin + 'http://localhost:8000/api/updatePoint',
		// 				form:{
		// 					message_id: messageId,
		// 					long: longitude,
		// 					lat: latitude,
		// 					created_at : created_at
		// 				}
		// 			}
		// 			console.log('THE ID IS NOT THE SAME!!!')
		// 			request.post(postOptions, (error, response, body)=>{
		// 				console.log('error from request post', error)
		// 				console.log('body from request post', body)
		// 			});
		// 			//check DB for friends in the area
		// 			// let friendNearOptions = {
		// 			// 	url: 'http://localhost:8000/api/friendNear',
		// 			// 	// url: 'https://whereissarkreact.herokuapp.com/api/friendNear',
		// 			// 	form : {
		// 			// 		long: -118.400261,
		// 			// 		lat: 33.871234
		// 			// 	}
		// 			// }
		// 			// request.post(friendNearOptions, (error, response, body)=>{
		// 			// 	console.log('error from friendNear POST', error);
		// 			// 	// console.log('response from friendNear POST', response);
		// 			// 	console.log('body from friendNear POST', body);
		// 			// })
		// 		}else{
		// 			console.log('SAME ID', results[0].message_id, messageId)
		// 		}
		// 	}
		// )
		///////END FRIEND NEAR TEST


		
		
	})
}

var getLastFiftyPoints = () => {
	request.get('https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0qyLXAX1l0neorapAYdqS0pnuDtThqtS4/message.json', function(error, response, body){
		var parsedBody = JSON.parse(body)
		// console.log('BODYYY FROM GET LAST 50', JSON.stringify(parsedBody))
		var fiftyMessages = parsedBody.response.feedMessageResponse.messages.message;
		console.log('FIFTYMESSAGES', fiftyMessages)
		Point.find({}, (err, results)=>{
			// var messageId = parsedBody.response.feedMessageResponse.messages.message.id;
			console.log('getting points');
			console.log('point find err ', err);
			let points = results;
			let pointIds = points.map(function(point){
				return point.message_id;
			})
			console.log('POINT ID ARRAY', pointIds)
			//LOOP THROUGH LAST 50 MESSAGES
			fiftyMessages.forEach(function(message){
			//IF REQUESTED MESSAGE ID NOT IN pointIds ARRAY THEN SAVE
				console.log('MESSAGE', message)
				if(pointIds.indexOf(message.id) == -1){
					//SAVE TO POINTS COLLECTION
					console.log('POINT NOT FOUND, ADDING FROM LAST 50: ', message)
					let createdAtUnix = moment(message.dateTime).unix();
					let createdAtFormatted = moment(message.dateTime).format('L LTS');
					Point.findOneAndUpdate(
						{message_id: message.id},
						{message_id: message.id, long: message.longitude, lat: message.latitude, created_at_unix : createdAtUnix, created_at_formatted: createdAtFormatted},
						{upsert: true, new: true}
					).exec()
				}else{
					console.log('POINT EXISTS, NOT ADDING', message)
				}
			})

		})
	})//END REQUEST GET
}

setInterval(function() {
	getPoints();
}, 240000);

setInterval(function() {
	getLastFiftyPoints();
}, 3600000);

getPoints();
getLastFiftyPoints();