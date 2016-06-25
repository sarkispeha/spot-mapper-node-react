import alt from '../alt';
import MapActions from '../actions/MapActions';

class MapStore {
  constructor() {
    this.bindActions(MapActions);
    this.points = [];
  }

  onGetPointsSuccess(data){
  	this.points = data;
  	console.log('this is this.points ', this.points)
  }

  onGetPointsFail(errorMessage){
  	console.warning(errorMessage)
  }

}

export default alt.createStore(MapStore);