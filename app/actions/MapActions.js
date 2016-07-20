import alt from '../alt';
import m from 'mithril';

class MapActions {
	constructor(){
		this.generateActions(
			'getPointsSuccess',
			'getPointsFail',
			'positionUpdate'
		);
	}

	getPoints() {
		let successAction = this.actions.getPointsSuccess;
		let failAction = this.actions.getPointsFail;
		m.request({
			method: 'GET',
			url : '/api/getPoints',
			unwrapSuccess: function(response){
				// console.log('response from mithril request ', response)
				successAction(response);
			},
			unwrapError: function(response){
				console.log(response.error)
				failAction(data);
			}
		})
	}
}

export default alt.createActions(MapActions);