import React from 'react';
import m from 'mithril';

class Form extends React.Component{
	
	constructor(props) {
		console.log('constructor is firing from Form');
		super(props);
		this.state = {
			firstname : '',
			lastname: '',
			email: '',
			address: '',
			city: '',
			state: '',
			zip: '',
			country: '',
			submitMessage: ''
		}
		console.log('this is the FORM state:', this.state)
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount(){

	}
	onChange(state) {
		console.log('onChange state', state)
		this.setState(state);
	}

	handleInputChange(e){
		let targetName = e.target.name
		this.setState({[targetName] : e.target.value})
		console.log(this.state[targetName])
	}

	handleSubmit(e){
		e.preventDefault()
		console.log(this.state)
		let nestedThis = this;
		let signupData = {
			"EMAIL" : this.state.email,
			"FNAME"	: this.state.firstname,
			"LNAME" : this.state.lastname,
			"ADDRESS" : this.state.address,
			"CITY" : this.state.city,
			"STATE" : this.state.state,
			"ZIP" : this.state.zip,
			"PAIS" : this.state.country 
		}
		console.log(signupData)
		m.request({
			method: 'GET',
			url : '//herokuapp.us13.list-manage.com/subscribe/post-json?u=b980b3fe7ab6efe9ab1c9e7b9&id=29430a42af',
			dataType: 'jsonp',
			callbackKey: 'c',
			data: signupData,
			unwrapSuccess: function(response){
				console.log('response from mithril mailchimp request ', response);
				nestedThis.setState({submitMessage: response.msg});
				// successAction(response);
			},
			unwrapError: function(response){
				console.log(response.error);
				// failAction(data);
			}
		})
		m.request({
			method: 'POST',
			url: '/api/friend',
			dataType: 'json',
			data: signupData,
			unwrapSuccess: function(response){
				console.log('response from mithril save friend api request', response);
			},
			unwrapError: function(response){
				console.log('error from mithril save friend request', response);
			}
		})

	}
	render() {
		console.log('FORM rendering')
		return <div className="friend-form">
			{this.state.submitMessage}
			<form>
				<input type="text" name="firstname" placeholder="First Name" value={this.state.firstname} onChange={this.handleInputChange}/>
				<input type="text" name="lastname" placeholder="Last Name" value={this.state.lastname} onChange={this.handleInputChange}/>
				<input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleInputChange}/>
				<input type="text" name="address" placeholder="Address" value={this.state.address} onChange={this.handleInputChange}/>
				<input type="text" name="city" placeholder="City" value={this.state.city} onChange={this.handleInputChange}/>
				<input type="text" name="state" placeholder="State" value={this.state.state} onChange={this.handleInputChange}/>
				<input type="number" name="zip" placeholder="Zip Code" value={this.state.zip} onChange={this.handleInputChange}/>
				<input type="text" name="country" placeholder="Country" value={this.state.country} onChange={this.handleInputChange}/>
				<button onClick={this.handleSubmit}> Submit</button>
			</form>
		</div>
	}
}

export default Form;