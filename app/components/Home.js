import React from 'react';
import {Link} from 'react-router';
// import HomeStore from '../stores/HomeStore'
// import HomeActions from '../actions/HomeActions';

class Home extends React.Component {

	// constructor(props) {
	//     super(props);
	//     this.state = HomeStore.getState();
	//     this.onChange = this.onChange.bind(this);
	// }

	render () { 
		return (
			<div>
				<h1>
					Where is Sark?
				</h1>
				<button>
					<Link to={'/map'}>Go to the Map</Link>
				</button>
			</div>
		);
	}
}

export default Home;