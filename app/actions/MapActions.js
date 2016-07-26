import alt from '../alt';
import m from 'mithril';

class MapActions {
	constructor(){
		this.generateActions(
			'getPointsSuccess',
			'getPointsFail',
			'positionUpdate',
			'getFriendsSuccess',
			'getFriendsFail',
			'friendUpdate'
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

	newPositionUpdate(newPosition) {
		this.actions.positionUpdate(newPosition);
	}

	getFriends(){
		let successAction = this.actions.getFriendsSuccess;
		let failAction = this.actions.getFriendsFail;
		m.request({
			method: 'GET',
			url : '/api/friends',
			unwrapSuccess: function(response){
				console.log('response from mithril request ', response)
				successAction(response);
			},
			unwrapError: function(response){
				console.log(response.error)
				failAction(data);
			}
		})
	}

	newFriendUpdate(newFriend){
		this.actions.friendUpdate(newFriend);
	}
}

export default alt.createActions(MapActions);