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
		if(friendInfo.ADDRESS.length !== 0 || friendInfo.CITY.length !== 0){
			let placeInfo = friendInfo.ADDRESS + ' ' + friendInfo.CITY + ' ' + friendInfo.STATE;
			geocoder.geocode(placeInfo,function(err, data){
				console.log('this is the error from geocoder', err);
				console.log('this is the data from geocoder', data);
				console.log('these are the coordinates from geocoder', data.results[0].geometry )
				friendInfo.latitude = data.results[0].geometry.location.lat;
				friendInfo.longitude = data.results[0].geometry.location.lng;
			})
			Friend.findOneAndUpdate(
				console.log('SAVING FRIEND TO DB'),
				{firstName: friendInfo.firstname, lastName: friendInfo.lastname},
				{firstName: friendInfo.firstname,
				lastName: friendInfo.lastname,
				email: friendInfo.email,
				address: friendInfo.address,
				city: friendInfo.city,
				zip: friendInfo.zip,
				state: friendInfo.state,
				country: friendInfo.country,
				lat: friendInfo.latitude,
				long: friendInfo.longitude
				},
				{upsert: true, new: true}
			).exec()
		}else{
			console.log('Not enough info to geocode');
		}
	}
}

module.exports = API;