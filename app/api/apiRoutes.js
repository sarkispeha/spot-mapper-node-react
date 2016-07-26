var Point = require('../../models/points');
var Friend = require('../../models/friends');
import geocoder from 'geocoder';

const API = {

	allPoints: (req, res)=>{
		console.log('allpoints API called')
		Point.find({}, (err, results)=>{
			console.log('getting points');
			console.log('point find err ', err);
			res.send(results);
		})
	},

	saveFriend: (req, res)=>{

		console.log('saving friend ENDPOINT')
		var friendInfo = req.body;
		console.log('THIS WOULD BE PLACEINFO', friendInfo.ADDRESS, friendInfo.CITY, friendInfo.STATE)

		var getCoordinates = new Promise(function(resolve, reject){
			console.log('PROMISE FIRING')
			if(friendInfo.ADDRESS.length !== 0 || friendInfo.CITY.length !== 0){
				let placeInfo = friendInfo.ADDRESS + ' ' + friendInfo.CITY + ' ' + friendInfo.STATE;
				geocoder.geocode(placeInfo,function(err, data){
					console.log('this is the error from geocoder', err);
					console.log('these are the coordinates from geocoder', data.results[0].geometry )
					friendInfo.latitude = data.results[0].geometry.location.lat;
					friendInfo.longitude = data.results[0].geometry.location.lng;
					return resolve('Success');
				})
			}else{
				console.log('Not enough info to geocode');
				return reject('Fail');
			}
		});
		getCoordinates.then(function(){
			// io.sockets.emit('newFriend', { newFriend: {lat: friendInfo.latitude, lng: friendInfo.longitude} });
			console.log('SAVING FRIEND TO DB', friendInfo);
			Friend.findOneAndUpdate(
				{firstName: friendInfo.FNAME, lastName: friendInfo.LNAME},
				{firstName: friendInfo.FNAME,
				lastName: friendInfo.LNAME,
				email: friendInfo.EMAIL,
				address: friendInfo.ADDRESS,
				city: friendInfo.CITY,
				zip: friendInfo.ZIP,
				state: friendInfo.STATE,
				country: friendInfo.COUNTRY,
				lat: friendInfo.latitude,
				long: friendInfo.longitude
				},
				{upsert: true, new: true}
			).exec()
			// res.sendStatus(200)
			res.send({ newFriend: {lat: friendInfo.latitude, lng: friendInfo.longitude} })
		}).catch(function(){
			console.log('CATCH')
		})
	},

	getFriends: (req,res)=>{
		console.log('allpoints API called')
		Friend.find({}, (err, results)=>{
			console.log('getting friends');
			console.log('friend find err ', err);
			res.send(results);
		})
	}
}

module.exports = API;