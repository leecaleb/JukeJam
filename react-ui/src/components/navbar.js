import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

class NavBar extends React.Component {
	constructor(props) {
		super(props)
		this.test = this.test.bind(this)
	}

	test() {
	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-fixed-top">
					<div className="container-fluid" style={{ marginLeft: 26 }}>
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<Link className="navbar-brand" to={'/user/' + this.props.user._id}>JukeJam</Link>
						</div>
					</div>
				</nav>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps) (NavBar)