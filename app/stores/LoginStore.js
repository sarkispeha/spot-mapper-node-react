import alt from '../alt';
import LoginActions from '../actions/LoginActions';

class LoginStore {
	constructor() {
		this.bindActions(LoginActions);
		this.user = {};
		this.signupSuccess = {};
	}

	onSignupSuccess(data){
		console.log('this is the onSignupSuccess data from LoginStore.js', data)
		this.signupSuccess = {success: data.success,
							msg: data.msg
							};
		window.success = this.signupSuccess;
	}
	onSignupFail(err){
		console.log(err)
	}

	onLoginSuccess(data){
		console.log('this is the data from LoginStore.js', data)
		this.user = data;
	}

	onLoginFail(err){
		console.log(err)
	}

}

export default alt.createStore(LoginStore);