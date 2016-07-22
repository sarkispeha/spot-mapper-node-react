// Babel ES6/JSX Compiler
require('babel-register');

var config = require('./config');

var async = require('async');
var request = require('request');
var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./app/routes');
var API =  require('./app/api/apiRoutes');
var Point = require('./models/points');
var config = require('./config')

var app = express();

//connect to database
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

/*
EXPRESS MIDDLEWARE
*/
app.set('port', process.env.PORT || 8000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);
/*
EXPRESS ROUTES
*/
// app.get('/api/getPoints', API.allPoints);
app.get('/api/getPoints', function(req, res, next){
		console.log('allpoints API called')
		//TODO: CHANGE THIS TO A FIND ON THE DB FOR THIS APP
		Point.find({}, (err, results)=>{
			console.log('getting points');
			console.log('point find err ', err);
			res.send(results);
		})
		/*		
		request.get('https://where-is-sark.herokuapp.com/api/getAllPoints', function(err, request, response){
			if(err){
				console.log('this is the err', err)
			}else{
				// console.log('this is the response', response);
				res.send(response)
			}
		})
		*/
	}
)

app.post('/api/updatePoint', function(req, res){
	var positionUpdate = req.body;
	io.sockets.emit('positionUpdate', { positionUpdate: positionUpdate });
	console.log('/api/updatePoint has been HIT!!!000000', req.body)
	var parsedBody = JSON.parse(req.body)
	var messageId = parsedBody.response.feedMessageResponse.messages.message.id;
	var latitude = parsedBody.response.feedMessageResponse.messages.message.latitude;
	var longitude = parsedBody.response.feedMessageResponse.messages.message.longitude;
	var created_at = parsedBody.response.feedMessageResponse.messages.message.dateTime.split('').splice(0,19).join('');
	Point.findOneAndUpdate(
		{message_id: messageId},
		{message_id: messageId, long: longitude, lat: latitude, created_at : created_at},
		{upsert: true, new: true}
	).exec()
	res.sendStatus(200)
})

/*
REACT ROUTER
*/
app.use(function(req, res) {
	console.log(req.url)
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', { html: html });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});