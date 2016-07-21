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

  onPositionUpdate(newPoint){
  	// this.positionUpdate = data;
    this.points.push(newPoint.positionUpdate)
    console.log('position updating from MapStorejs', this.points)
  }

}

export default alt.createStore(MapStore);