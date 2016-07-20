import alt from '../alt';
import MapActions from '../actions/MapActions';

class MapStore {
  constructor() {
    this.bindActions(MapActions);
    this.points = [];
    this.positionUpdate = {};
  }

  onGetPointsSuccess(data){
  	this.points = data;
  	// console.log('this is this.points ', this.points)
  }

  onGetPointsFail(errorMessage){
  	console.warning(errorMessage)
  }

  onPositionUpdate(data){
  	this.positionUpdate = data.positionUpdate;
  }

}

export default alt.createStore(MapStore);