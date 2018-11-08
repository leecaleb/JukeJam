import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux';

class NavBar extends React.Component {
	constructor(props) {
		super(props)
		this.handleToCreateRoom = this.handleToCreateRoom.bind(this)
	}

	handleToCreateRoom() {
		document.getElementById('mainfeed-body').style.opacity = 0.2
		// document.getElementById('create-room-modal').style.visibility = 'visible'
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
							<Link className="navbar-brand" to={'/user/' + this.props.user._id}>JukeJam</Link>
						</div>
						<ul className="nav navbar-nav navbar-right" id="create-room-button">
							<li><a><button onClick={this.handleToCreateRoom}>Create Room</button></a></li>
						</ul>
					</div>
				</nav>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user.userData
	}
}

export default connect(mapStateToProps) (NavBar)