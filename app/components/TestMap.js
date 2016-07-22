import React from 'react';
import {Link} from 'react-router';
import MapStore from '../stores/MapStore';
import MapActions from '../actions/MapActions';

class TestMap extends React.Component{

	constructor(props) {
		console.log('constructor is firing from testmaps');
		super(props);
		this.state = MapStore.getState();
		console.log('this is thes state:', this.state)
		this.onChange = this.onChange.bind(this);
	}
	// static propTypes() {
 //  		initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
	// }

	render() {
		return <div className="GMap">
		  <div className='UpdatedText'>
			<p>Current Zoom: 10</p>
			<p>Current Lat: {this.state.currentLat}</p>
			<p>Current Long: {this.state.currentLong}</p>
		  </div>
		  <div className='GMap-canvas' ref="mapCanvas">
		  </div>
		</div>
	}

	componentDidMount() {
  		console.log('componentDidMount from maps is firing')
    	MapStore.listen(this.onChange);
    	MapActions.getPoints();

    	let socket = io.connect();
    	socket.on('positionUpdate', (data) => {
    		console.log('SOCKET UPDATE', data)
	    	MapActions.newPositionUpdate(data);
	    });
  	}

  	onChange(state) {
    	this.setState(state);
    	let pathPointData = this.state.points;
    	this.map = this.createMap(pathPointData);
    	this.path = this.createPath(pathPointData);
    	this.marker = this.createMarker(pathPointData)
  		console.log('onChange from maps is firing', state)
  	}

  /*componentDidMount() {
	// create the map, marker and infoWindow after the component has
	// been rendered because we need to manipulate the DOM for Google =(
	this.map = this.createMap()
	// this.marker = this.createMarker()
	// this.infoWindow = this.createInfoWindow()
  
	// have to define google maps event listeners here too
	// because we can't add listeners on the map until its created
	// google.maps.event.addListener(this.map, 'zoom_changed', ()=> this.handleZoomChange())
  }*/

  // clean up event listeners when component unmounts
  // componentDidUnMount() {
  //   google.maps.event.clearListeners(map, 'zoom_changed')
  // }

  createMap(pathPointData) {
	let mapOptions = {
	  zoom: 10,
	  center: this.mapCenter(pathPointData),
	  mapTypeId: google.maps.MapTypeId.HYBRID
	}
	return new google.maps.Map(this.refs.mapCanvas, mapOptions)
  }

  createPath(pathPointData) {
  	var pathCoordinates = []
  	pathPointData.forEach(function(obj){
		pathCoordinates.push({lat : obj.lat, lng : obj.long});
	});
	console.log('pathCoordinates', pathCoordinates)
	return new google.maps.Polyline({
		map: this.map,					
		path: pathCoordinates,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
		});
  }

  mapCenter(pathPointData) {
  	// console.log('pathPointData from mapcenter', pathPointData)
  	if (pathPointData != undefined){
  		let lastPoint = pathPointData[pathPointData.length-1];
  		console.log('last Point', lastPoint)
  		var lastCoordinate = {lat: lastPoint.lat , lng : lastPoint.long, message_id : lastPoint.message_id}
  		this.setState({
  			currentLong: lastPoint.long,
  			currentLat: lastPoint.lat
  		})

		console.log('state long', this.state.currentLong)
		return new google.maps.LatLng({
			lat: lastPoint.lat, 
			lng: lastPoint.long
		})	
  	}
  }

  createMarker(pathPointData) {
	return new google.maps.Marker({
	  position: this.mapCenter(pathPointData),
	  map: this.map
	})
	}

  createInfoWindow() {
	let contentString = "<div class='InfoWindow'>I'm a Window that contains Info Yay</div>"
	return new google.maps.InfoWindow({
	  map: this.map,
	  anchor: this.marker,
	  content: contentString
	})
  }
  
  handleZoomChange() {
	this.setState({
	  zoom: this.map.getZoom()
	})
  }
}

export default TestMap;