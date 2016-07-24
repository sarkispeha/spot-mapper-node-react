import React from 'react';
import m from 'mithril';

class Form extends React.Component{
	
	constructor(props) {
		console.log('constructor is firing from Form');
		super(props);
		this.state = {
			firstname : '',
			lastname: '',
			EMAIL: '',
			zip: 0,
			country: ''
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
		let signupData = {
			"EMAIL" : this.state.EMAIL,
			"FNAME"	: this.state.firstname,
			"LNAME" : this.state.lastname,
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
				console.log('response from mithril request ', response)
				// successAction(response);
			},
			unwrapError: function(response){
				console.log(response.error)
				// failAction(data);
			}
		})

	}
	render() {
		console.log('FORM rendering')
		return <div className="friend-form">
			{this.state.firstname}
			<form>
				<input type="text" name="firstname" placeholder="First Name" value={this.state.firstname} onChange={this.handleInputChange}/>
				<input type="text" name="lastname" placeholder="Last Name" value={this.state.lastname} onChange={this.handleInputChange}/>
				<input type="email" name="EMAIL" placeholder="Email" value={this.state.EMAIL} onChange={this.handleInputChange}/>
				<input type="number" name="zip" placeholder="Zip Code" value={this.state.zip} onChange={this.handleInputChange}/>
				<input type="text" name="country" placeholder="Country" value={this.state.country} onChange={this.handleInputChange}/>
				<button onClick={this.handleSubmit}> Submit</button>
			</form>
		</div>
	}
}

export default Form;