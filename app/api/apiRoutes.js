var Point = require('../../models/points');

const API = {

	allPoints: (req, res)=>{
		console.log('allpoints API called')
		Point.find({}, (err, results)=>{
			console.log('getting points');
			console.log('point find err ', err);
			res.send(results);
		})
	}
}

module.exports = API;