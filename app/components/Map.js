import React from 'react';
import {Link} from 'react-router';
import { GoogleMapLoader, GoogleMap, Polyline} from "react-google-maps";
import { default as _ } from "lodash";
import MapStore from '../stores/MapStore';
import MapActions from '../actions/MapActions';

class Map extends React.Component {

	constructor(props) {
		console.log('constructor is firing from maps');
    	super(props);
    	this.state = MapStore.getState();
    	this.onChange = this.onChange.bind(this);
  	}

  	componentDidMount() {
  		console.log('componentDidMount from maps is firing')
    	MapStore.listen(this.onChange);
    	MapActions.getPoints();

    	let socket = io.connect();
    	socket.on('positionUpdate', (data) => {
    		console.log('SOCKET UPDATE', data)
	    	MapActions.positionUpdate(data);
	    });
  	}

  	onChange(state) {
    	this.setState(state);
  		console.log('onChange from maps is firing', state)
  	}

	render() {
		console.log('render firing from maps')
		console.log('this.state.points', this.state.points)
		var pathPointData = this.state.points;
		var pathCoordinates = []
		pathPointData.forEach(function(obj){
			pathCoordinates.push({lat : obj.lat, lng : obj.long});
		});
		return (
			<GoogleMapLoader
				containerElement = {
					<div
						{...this.props}
						style={{
							height: '100vh',
							width: '100vw'
						}}
					/>
				}
				googleMapElement={
					<GoogleMap
						ref={(map) => this._googleMapComponent = map}
						defaultZoom={5}
	            		defaultCenter={{lat: 39.8275062, lng: -98.5810004}}
	            	>
	            	<Polyline
	            		path={pathCoordinates}
	            		geodesic= {true}
						strokeColor= {'#FFFFFF'}
						strokeOpacity= {1.0}
						strokeWeight= {2}
	            	>
	            	</Polyline>
	            	</GoogleMap>
				}
			/>
		)
	}

}

export default Map;