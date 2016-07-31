'use strict'
const request = require('request');
const Point = require('../models/points.js');
const Friend = require('../models/friends.js');
const mongoose = require('mongoose');
var config = require('../config')

mongoose.connect(config.database);

var getPoints = () => {
	console.log('WORKER IS FIRING TO SPOT API', new Date());
	// request.get('https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0qyLXAX1l0neorapAYdqS0pnuDtThqtS4/latest.json', function(error, response, body){
	// 	// console.log('this is the body from first request', body);
	// 	var parsedBody = JSON.parse(body)
	// 	var messageId = parsedBody.response.feedMessageResponse.messages.message.id;
	// 	var latitude = parsedBody.response.feedMessageResponse.messages.message.latitude;
	// 	var longitude = parsedBody.response.feedMessageResponse.messages.message.longitude;
	// 	var created_at = parsedBody.response.feedMessageResponse.messages.message.dateTime.split('').splice(0,19).join('');
	// 	console.log('FROM WORKER: POINT ID', messageId);
	// 	console.log('lat: ', latitude, 'long :', longitude, 'created_at :', created_at)
	// 	Point.find({message_id: messageId}
	// 		, function(err, results){
	// 			console.log('the results of the find', results)
	// 			if(results.length == 0 || results[0].message_id !== messageId){
	// 				//request an API route that will hit the socket.io
	// 				let postOptions = {
	// 					url: urlOrigin + 'http://localhost:8000/api/updatePoint',
	// 					form:{
	// 						message_id: messageId,
	// 						long: longitude,
	// 						lat: latitude,
	// 						created_at : created_at
	// 					}
	// 				}
	// 				console.log('THE ID IS NOT THE SAME!!!')
	// 				request.post(postOptions, (error, response, body)=>{
	// 					console.log('error from request post', error)
	// 					console.log('body from request post', body)
	// 				});
					//check DB for friends in the area
					let friendNearOptions = {
						url: 'http://localhost:8000/api/friendNear',
						// url: 'https://whereissarkreact.herokuapp.com/api/friendNear',
						form : {
							long: -118.400261,
							lat: 33.871234
						}
					}
					request.post(friendNearOptions, (error, response, body)=>{
						console.log('error from friendNear POST', error);
						// console.log('response from friendNear POST', response);
						console.log('body from friendNear POST', body);
					})
		// 		}else{
		// 			console.log('SAME ID', results[0].message_id, messageId)
		// 		}
		// 	}
		// )
		// find one and update the previous point if not new
		/* REINSTATE AFTER TESTING
		Point.findOneAndUpdate(
			{message_id: messageId},
			{message_id: messageId, long: longitude, lat: latitude, created_at : created_at},
			{upsert: true, new: true}
		).exec()
		*/
	// })
}

setInterval(function() {
	getPoints();
}, 180000);

getPoints();