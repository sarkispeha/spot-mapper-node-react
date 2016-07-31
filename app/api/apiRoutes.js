var Point = require('../../models/points');
var Friend = require('../../models/friends');
import geocoder from 'geocoder';
import moment from 'moment';
import mcapi from 'mailchimp-api';
const mc = new mcapi.Mailchimp(process.env.MAILCHIMP_API_KEY)
const friendsListId = process.env.MAILCHIMP_FRIENDS_LIST;
import mandrillSend from '../services/mandrillSend'

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

		var getCoordinates = new Promise(function(resolve, reject){
			if(friendInfo.ADDRESS.length !== 0 || friendInfo.CITY.length !== 0){
				let placeInfo = friendInfo.ADDRESS + ' ' + friendInfo.CITY + ' ' + friendInfo.STATE;
				geocoder.geocode(placeInfo,function(err, data){
					// console.log('this is the error from geocoder', err);
					// console.log('these are the coordinates from geocoder', data.results[0].geometry )
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
				geoLocation: {
					coordinates: [friendInfo.longitude, friendInfo.latitude]
					},
				emailSent: '',
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
	},

	friendNear:(req,res)=>{
		console.log('friendNear API called');
		var geoData = req.body;
		console.log('geoData', geoData)
		Friend.find(
			{'geoLocation.coordinates':
				{$near:
					{$geometry:
						{type: "Point", coordinates: [geoData.long, geoData.lat]},
						$minDistance: 0,
						$maxDistance: 100000
					}
				}
			},
			(err, results)=>{
				console.log('results from friendNear geofind',results);
				console.log('err from friendNear geofind', err);
				let foundFriendArr = results;
				if(results.length != 0){
					console.log('FRIENDS FOUND IN SEARCH')
					//go through array and update emailSent

					foundFriendArr.forEach((friendInArea)=>{
					//if emailSent was less than 30 days from last sending do not send out email
						let emailSentDate = friendInArea.emailSent.length > 0 ? friendInArea.emailSent : '1945-08-06';
						console.log('emailSentDate', emailSentDate)
						let startDate = moment(emailSentDate, 'YYYY-MM-DD');
						// console.log('startDate', startDate)
						let sendEmailAfterDate = moment(startDate).add(30, 'days');
						// console.log('sendEmailAfterDate', sendEmailAfterDate)
						var day = sendEmailAfterDate.format('DD');
						var month = sendEmailAfterDate.format('MM');
						var year = sendEmailAfterDate.format('YYYY');
						var today = moment();
						// let sendEmailAfterDate = moment([2016, 8, 21]).add(30, 'days');
						console.log('sendEmailAfterDate', year, month, day)
						let strToday = today.format('YYYY') +'-'+ today.format('MM') +'-'+ today.format('DD');
						console.log(strToday)
						// console.log('sendEmailAfterDate', sendEmailAfterDate)
						if(moment(today).isAfter(sendEmailAfterDate)){
							//if emailsent was greater than 30 days from last sending send email and update friend emailsent
							console.log('NOW WE SEND OUT THE EMAILS')
							// mandrillSend('proximity_email', 'Sark\'s in your \'hood!', friendInArea.firstName, friendInArea.email);
							//update the emailSent date
							Friend.findOneAndUpdate(
								{firstName: friendInArea.firstName, lastName: friendInArea.lastName},
								{emailSent: strToday},
								{upsert: true, new: true}
								).exec()//end findOneAndUpdate
							
						}//end if statement
					})//end forEach

				}else{
					console.log('NO FRIENDS WERE FOUND IN SEARCH')
				}
				// res.send(results);
				res.sendStatus(200);
			}
		)
	}
}

module.exports = API;