// Babel ES6/JSX Compiler
require('babel-register');

var config = require('./config');

var async = require('async');
var request = require('request');
var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./app/routes');
var API =  require('./app/api/apiRoutes');
// var Character = require('./models/character');
var app = express();

/*
EXPRESS MIDDLEWARE
*/
app.set('port', process.env.PORT || 8000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


/*
EXPRESS ROUTES
*/
// app.get('/api/getPoints', API.allPoints);
app.get('/api/getPoints', function(req, res, next){
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
)
/*
REACT ROUTER
*/
app.use(function(req, res) {
	console.log(req.url)
  Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
  	console.log('err ',err)
  	console.log('redirectLocation', redirectLocation)
  	console.log('renderProps ',renderProps)
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

var server = require('http').createServer(app);
server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});