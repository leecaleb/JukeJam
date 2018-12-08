import React from 'react'
import NavBar from './navbar'
import ErrorBanner from './errorbanner';
import { connect } from 'react-redux';

class Profile extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		console.log(this.props.user.userData)
		return (
			<div>
				{/* <NavBar /> */}
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							{/* <ErrorBanner /> */}
						</div>
					</div>
					<div className="col-md-12 profile">
						<h1>Profile of user with id: </h1>
					</div>

				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps) (Profile)
