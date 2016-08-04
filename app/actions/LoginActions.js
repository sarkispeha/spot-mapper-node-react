import alt from '../alt';
import m from 'mithril';

class LoginActions {
	constructor(){
		this.generateActions(
			'signupSuccess',
			'signupFail',
			'loginSuccess',
			'loginFail'
		);
	}

	postSignup(signupData){
		let successAction = this.signupSuccess;
		let failAction = this.signupFail;
		console.log('signup data', signupData)
		m.request({
			method: 'POST',
			url : '/appSignup',
			dataType: 'json',
			data: signupData,
			unwrapSuccess: function(response){
				console.log('response from mithril request in LoginActions', response)
				successAction(response);
			},
			unwrapError: function(response){
				console.log('signup Error', response.error)
				failAction(response);
			}
		})
	}

	postLogin(loginData){
		let successAction = this.loginSuccess;
		let failAction = this.loginFail;
		m.request({
			method: 'POST',
			url : '/appLogin',
			dataType: 'json',
			data: loginData,
			unwrapSuccess: function(response){
				console.log('response from mithril request in LoginActions', response)
				successAction(response);
			},
			unwrapError: function(response){
				console.log(response.error)
				failAction(data);
			}
		})
	}
}

export default alt.createActions(LoginActions);