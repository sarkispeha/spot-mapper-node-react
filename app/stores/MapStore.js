import alt from '../alt';
import MapActions from '../actions/MapActions';

class MapStore {
  constructor() {
    this.bindActions(MapActions);
    this.points = [];
    this.positionUpdate = {};
    this.friends = [];
    this.friendUpdate = {};
  }

  onGetPointsSuccess(data){
  	this.points = data;
  	// console.log('this is this.points ', this.points)
  }

  onGetPointsFail(errorMessage){
  	console.warn(errorMessage)
  }

  onPositionUpdate(newPoint){
    this.points.push(newPoint.positionUpdate)
    console.log('position updating from MapStorejs', this.points)
  }

  onGetFriendsSuccess(data){
    this.friends = data;
  }

  onGetFriendsFail(errorMessage){
    console.warn(errorMessage)
  }

  onFriendUpdate(newFriend){
    console.log('newfriend from mapstore', newFriend)
    // this.friends.push(newFriend)
    this.friendUpdate.lat = newFriend.lat;
    this.friendUpdate.lng = newFriend.lng;
    this.friendUpdate.isNewPoint = true;
  }

}

export default alt.createStore(MapStore);