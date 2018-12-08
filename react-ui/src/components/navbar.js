import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { logout } from '../server'
import { bindActionCreators } from 'redux'
import { redux_logout } from '../actions/index'

class NavBar extends React.Component {
	constructor(props) {
		super(props)
		this.handleLogout = this.handleLogout.bind(this)
	}

	handleLogout() {
		logout(() => {
			this.props.redux_logout()
			window.location.href = process.env.NODE_ENV === 'development' ?
				'http://localhost:3000' : 'https://jukejam.hirecaleblee.me'
		})
	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-fixed-top">
					<div className="container-fluid" style={{ marginLeft: 26, width:'100%' }}>
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
								<span className="sr-only">Toggle navigation</span>
							</button>
							<Link className="navbar-brand" to={'/user/' + this.props.user.userData._id}>JukeJam</Link>
						</div>
						{this.props.user.loggedin ? 
							<ul className="nav navbar-nav navbar-right" id="logout-button">
								<li><button onClick={this.handleLogout}>Logout</button></li>
							</ul> : null}						
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

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({redux_logout}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (NavBar)