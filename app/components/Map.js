import React from 'react';
import {Link} from 'react-router';
import MapStore from '../stores/MapStore';
import MapActions from '../actions/MapActions';
import Form from './Form'
import moment from 'moment';

class Map extends React.Component{

	constructor(props) {
		// console.log('constructor is firing from map');
		super(props);
		this.state = MapStore.getState();
		console.log('this is the state:', this.state)
		this.createFriendsMarkers = this.createFriendsMarkers.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	// static propTypes() {
 //  		initialCenter: React.PropTypes.objectOf(React.PropTypes.number).isRequired
	// }

	render() {
		return <div className="GMap">

			<div className='UpdatedText'>
				<a href="https://www.patreon.com/bePatron?c=402586&rid=1890088">
					<div className="help-me-button">Help me run the servers!</div>
				</a>
			  	<p>Current Lat: {this.state.currentLat}</p>
				<p>Current Long: {this.state.currentLong}</p>
				<button onClick={this.createFriendsMarkers}>Mark friends on Map</button>
			</div>
			<div className='GMap-canvas' ref="mapCanvas">
			</div>
		</div>
	}
	// <Form/> //TAKE OUT FOR TIME BEING

	componentDidMount() {
  		// console.log('componentDidMount from maps is firing')
    	MapStore.listen(this.onChange);
    	MapActions.getPoints();
    	MapActions.getFriends();

    	// this.createFriendsMarkers = this.createFriendsMarkers.bind(this);

    	let socket = io.connect();
    	socket.on('positionUpdate', (data) => {
    		console.log('SOCKET UPDATE', data)
	    	MapActions.newPositionUpdate(data);
	    });
		// socket.on('newFriend', (data)=>{
		// 	console.log('NEWFRIEND SOCKET', data)
		// 	MapActions.newFriendUpdate(data)
		// });	
  	}

  	onChange(state) {
    	this.setState(state);
    	let pathPointData = this.state.points;
    	this.map = this.createMap(pathPointData);
    	this.path = this.createPath(pathPointData);
    	this.marker = this.createMarker(pathPointData)
    	this.newFriendMarker = this.createNewFriendMarker()

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

  	pathPointData.map(function(obj){
  		if(obj.created_at_unix){
  			return obj;
  		}else if(obj.created_at){
  			obj.created_at_unix = moment(obj.created_at).unix();
  			return obj;
  		}else{
  			return obj;
  		}
  	})

  	pathPointData.sort(function(a,b){
  		return a.created_at_unix - b.created_at_unix;
  	})

  	pathPointData.forEach(function(obj){
  		console.log(obj.created_at_unix)
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
  		// console.log('last Point', lastPoint)
  		var lastCoordinate = {lat: lastPoint.lat , lng : lastPoint.long, message_id : lastPoint.message_id}
  		this.setState({
  			currentLong: lastPoint.long,
  			currentLat: lastPoint.lat
  		})
  		if(this.state.friendUpdate.isNewPoint == true){
  			this.state.friendUpdate.isNewPoint = false;
  			// console.log('this is the log of friendUpdate',this.state.friendUpdate)
  			this.setState({friendUpdate: this.state.friendUpdate})
  			return new google.maps.LatLng({
				lat: this.state.friendUpdate.lat, 
				lng: this.state.friendUpdate.lng
			})
  		}else{
			// console.log('state long', this.state.currentLong)
			return new google.maps.LatLng({
				lat: lastPoint.lat, 
				lng: lastPoint.long
			})
		}
  	}
  }

	createMarker(pathPointData) {
		return new google.maps.Marker({
			position: this.mapCenter(pathPointData),
			map: this.map
		})
	}

	createFriendsMarkers(){
		let nestedMap = this.map;
		console.log('this.state.friends', this.state.friends)
		this.state.friends.forEach(function(obj){
			return new google.maps.Marker({
				position: {lat: obj.geoLocation.coordinates[1], lng: obj.geoLocation.coordinates[0]},
				map: nestedMap
			})
		})
	}

	createNewFriendMarker(){
		console.log('createNewFriendMarker FIRING', this.state.friendUpdate)

		let newFriendCoord = { lat: this.state.friendUpdate.lat, lng: this.state.friendUpdate.lng }
		console.info('newFriendCoord', newFriendCoord)
		if(newFriendCoord.lat == undefined || newFriendCoord.lng == undefined){
			console.warn('no new friend to place on the goddamn map')
		}else{
			return new google.maps.Marker({
				position: newFriendCoord,
				map: this.map
			})
		}
	}

	friendsInVicinity(){

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

export default Map;