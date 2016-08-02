import React from 'react';

class Login extends React.Component{

	constructor(props) {
		console.log('constructor is firing from LOGIN');
		super(props);
		this.state = {
			email: '',
			password: ''
		}
		console.log('this is the FORM state:', this.state)
		this.handleInputChange = this.handleInputChange.bind(this)
		// this.handleSubmit = this.handleSubmit.bind(this)
		this.onChange = this.onChange.bind(this);
	}

	handleInputChange(e){
		let targetName = e.target.name
		this.setState({[targetName] : e.target.value})
	}

	handleSubmit(e){
		e.preventDefault()
	}

	render () { 
		return (
			<div>
				<h1>
					Signup
				</h1>
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

export default Home;