import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Map from './components/Map';
// import Login from './component/Login';

export default (
	<Route component={App}>
		<Route path='/' component={Home} />
		<Route path='/map' component={Map} />
	</Route>
);