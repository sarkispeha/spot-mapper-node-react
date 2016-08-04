import React from 'react';
import LoginStore from '../stores/LoginStore';
import LoginActions from '../actions/LoginActions';

class Login extends React.Component{

	constructor(props) {
		console.log('constructor is firing from LOGIN');
		super(props);
		this.state = {
			signupEmail: '',
			signupPassword: '',
			email: '',
			password: ''
		}
		console.log('this is the Login state:', this.state)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSignup = this.handleSignup.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.onChange = this.onChange.bind(this);
	}

	onChange(state) {
		this.setState(state);
		console.log('onChange from Login is firing', state)
	}

	handleInputChange(e){
		let targetName = e.target.name
		this.setState({[targetName] : e.target.value})
	}

	handleSignup(e){
		e.preventDefault()
		let newUserCredentials = {
			signupEmail : this.state.signupEmail,
			signupPassword : this.state.signupPassword
		}
		LoginActions.postSignup(newUserCredentials)
	}

	handleSubmit(e){
		e.preventDefault()
		let userCredentials = {
			email : this.state.email,
			password : this.state.password
		}
		LoginActions.postLogin(userCredentials)
	}

	render () { 
		return (
			<div>
				<h1>
					Signup
				</h1>
				<div className='signup-form'>
					<form>
						<input type="email" name="signupEmail" placeholder="Email" value={this.state.signupEmail} onChange={this.handleInputChange}/>
						<input type="password" name="signupPassword" placeholder="password" value={this.state.signupPassword} onChange={this.handleInputChange}/>
						<button onClick={this.handleSignup}> Sign Up</button>
					</form>
				</div>
				<div className='login-form'>
					<form>
						<input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange}/>
						<input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.handleInputChange}/>
						<button onClick={this.handleSubmit}> Login</button>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;