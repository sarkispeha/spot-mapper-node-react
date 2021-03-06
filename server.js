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
app.get('/api/getPoints', API.allPoints);
//TODO abstract sockets to api
app.post('/api/updatePoint', function(req, res){
	var positionUpdate = req.body;
	io.sockets.emit('positionUpdate', { positionUpdate: positionUpdate });
	console.log('/api/updatePoint has been HIT!!!000000', req.body)
	var parsedBody = req.body
	var messageId = parsedBody.message_id;
	var latitude = parsedBody.lat;
	var longitude = parsedBody.long;
	var created_at = parsedBody.created_at;
	var newPoint = new Point({message_id: messageId, long: longitude, lat: latitude, created_at : created_at})
	Point.findOneAndUpdate(
		{message_id: messageId},
		{message_id: messageId, long: longitude, lat: latitude, created_at : created_at},
		{upsert: true, new: true}
	).exec()
	res.sendStatus(200)
})

app.get('/api/friends', API.getFriends);
app.post('/api/friends', API.saveFriend);
app.post('/api/friendNear', API.friendNear);
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