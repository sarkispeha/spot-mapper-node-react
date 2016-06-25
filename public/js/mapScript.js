// var data = !{JSON.stringify(data)};
// console.log(data);

// var pathCoordinates = []

// data.forEach(function(track){
// 	pathCoordinates.push({lat : track.lat, lng : track.long});
// });

// var lastCoordinate = {lat: data[data.length-1].lat , lng : data[data.length-1].long, message_id : data[data.length-1].message_id}

var map;
var marker;
var trackPath;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 39.8275062, lng: -98.5810004}, //center of the USA
		// center: lastCoordinate,
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.HYBRID
	});
	// trackPath = new google.maps.Polyline({
	// 	path: pathCoordinates,
	// 	geodesic: true,
	// 	strokeColor: '#FF0000',
	// 	strokeOpacity: 1.0,
	// 	strokeWeight: 2
	// });

	// marker = new google.maps.Marker({
	// 	map: map, 
	// 	position: new google.maps.LatLng(lastCoordinate)
	// });
	// trackPath.setMap(map);

	//http://stackoverflow.com/questions/4752340/how-to-zoom-in-smoothly-on-a-marker-in-google-maps
	// function smoothZoom (map, max, cnt) {
	// 	if (cnt >= max) {
	// 		return;
	// 	}
	// 	else {
	// 		z = google.maps.event.addListener(map, 'zoom_changed', function(event){
	// 			google.maps.event.removeListener(z);
	// 			smoothZoom(map, max, cnt + 1);
	// 		});
	// 		setTimeout(function(){map.setZoom(cnt)}, 90);
	// 	}
	// }

	// var findSarkButton = document.getElementById('findSark');
	// findSarkButton.addEventListener('click', function(event){
	// 	map.setCenter(lastCoordinate);
	// 	smoothZoom(map, 14, map.getZoom());
	// });

}//end initMap
// function newPosition(){
// 	var newPath = trackPath.getPath()
// 	var point = m.prop([])
// 	var domain = window.location.origin;
// 	m.request({
// 		method : 'GET',
// 		url: domain+'/api/lastPoint',
// 		unwrapSuccess: function(response) {
// 			return response;
// 		},
// 		unwrapError: function(response) {
// 			console.log(response.error)
// 			return response.error;
// 		}
// 	})
// 	.then(point)
// 	.then(function(){
// 		if (point().message_id !== lastCoordinate.message_id){
// 			console.warn('NEW COORDINATE')
// 			console.log('point', point());
// 			console.log('lastCoordinate', lastCoordinate)
// 			lastCoordinate = {lat: point().lat , lng : point().long, message_id : point().message_id}
// 			//- var newPoint = {lat: point().lat , lng : point().long};
// 			//- console.log('lastCoordinate', lastCoordinate);
// 			pathCoordinates.push(lastCoordinate)
// 			console.log('pathCoordinates',pathCoordinates)
// 			//- newPath.push(newPoint)
// 			trackPath = new google.maps.Polyline({
// 				path: pathCoordinates,
// 				geodesic: true,
// 				strokeColor: '#FF0000',
// 				strokeOpacity: 1.0,
// 				strokeWeight: 2
// 			});
// 			trackPath.setMap(map);
// 			marker.setPosition(lastCoordinate)
// 		}else{
// 			console.info('no change in last coordinate')
// 		}
// 		//- return point();
// 	})
// }

// setInterval(function() {
// 	newPosition();
// }, 300000);