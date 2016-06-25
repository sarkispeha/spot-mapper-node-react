

const API = {
	//create routes then export to server.js


	// app.get('/api/getPoints', function(req, res){
	allPoints: (req, res)=>{
		console.log('allpoints called')
		request.get('https://where-is-sark.herokuapp.com/api/getAllPoints', function(err, request, response){
			if(err){
				console.log('this is the err', err)
			}else{
				console.log('this is the response', response);
				res.send(response)
			}
		})
	}
	// })
}

module.exports = API;