import React from 'react'
import {Link} from 'react-router'
import {getGroupData, addToRoom} from '../../server'
import GroupPlaylist from './components/groupplaylist'
import SearchPanel from './components/searchpanel'
import { connect } from 'react-redux'
import { loadUserData } from '../../actions/index'
import { bindActionCreators } from 'redux'

class GroupInfo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			groupInfo: []
		}
		this.searchPanelRef = this.searchPanelRef.bind(this)
		this.handleLeavePanel = this.handleLeavePanel.bind(this)
		this.handleIntroduced = this.handleIntroduced.bind(this)
		this.handleSendContributionRequest = this.handleSendContributionRequest.bind(this)
	}

	componentDidMount () {
		document.addEventListener('mousedown', this.handleLeavePanel)
		getGroupData(this.props.groupId, (group) => {
			this.setState({groupInfo: group})
		})
	}

	handleGroupPlaylist(song, action, spotify_search) {
		if (spotify_search) {
			this.playlist.refresh(song, action)
		} else {
			this.playlist.refreshForYoutube(song, action)
		}
	}

	searchPanelRef (node) {
		this.panelRef = node
	}

	handleLeavePanel (e) {
		if(this.panelRef && !this.panelRef.contains(e.target)) {
			document.getElementById('search-body').style.display = 'none'
			document.getElementById('search-input').style.display = 'none'
			document.getElementById('search-enter-btn').style.display = 'none'
		}
	}

	returnIntroModal() {
		return (
			<div>
				<div className="container-fluid" id="blur">
				</div>
				<div className="panel panel-default" id="no-friend-modal">
					<div className="panel-body">
						Welcome! Mark created this JukeJam room in hopes to build a playlist with his friends. 
						As a guest, you can checkout some of the songs they included. Click play and the playlist will autoplay!
					</div>
					<div className="panel-body">
						<button type="button" className="btn btn-default" onClick={this.handleIntroduced} style={{ marginLeft: '80%' }}>
							Ok
						</button>
					</div>
				</div>
			</div>
		)
	}

	handleIntroduced() {
		document.getElementById('blur').style.display = 'none'
		document.getElementById('no-friend-modal').style.display = 'none'
		document.getElementById('contribute-request-btn').style.display = 'block'
		var elem = document.getElementById('contribute-request-btn')
		setInterval(frame, 1000)
		function frame() {
			elem.style.backgroundColor = elem.style.backgroundColor === 'white' ? '#D3D3D3' : 'white'
		}
	}

	handleSendContributionRequest() {
		addToRoom('000000000000000000000004', this.props.user.userData._id, this.props.groupId, (user) => {
			user.newUser = false
			this.props.loadUserData(user)
			window.location.reload()
		})
	}

	render() {
		let search = []
		if (this.props.auth) {
			search.push(
				<div key={0} className="container" style={{ height: '40%'}}>
					<div key={0} ref={this.searchPanelRef}>
						<SearchPanel
							handleGroupPlaylist={this.handleGroupPlaylist.bind(this)}
							groupId = {this.props.groupId}
							songs= {this.state.groupInfo.songs}/>
					</div>
				</div>

			)
		}

		let users = []
		if (this.props.onlineUsers) {
			users = this.props.onlineUsers
		}

		return (
			<div>
				{this.props.user.userData.newUser  ? this.returnIntroModal() : null}
				<div className="col-md-12 room-title">
					{search}
					<div className="container usersList">
						<div className="row">
							<h1>{this.state.groupInfo.groupName}</h1>

							{users.map((user) => {
								return(
									<Link to={'/profile/' + user.userId} key={user.userId}><div id="userThumb">{user.username}</div></Link>
								)
							})}
							{this.props.user.userData.newUser ?
								<div>
									<button type="button" className="btn btn-default" id="contribute-request-btn" onClick={this.handleSendContributionRequest}>
										Want to contribute? <br/>Send a request to Mark
									</button>
								</div>
								: null}
						</div>
					</div>
				</div>
				<div className="container-fluid">
					<GroupPlaylist
						groupId={this.props.groupId}
						groupInfo={this.state.groupInfo}
						onRef={ref => this.playlist = ref} />
				</div>
			</div>
		)
	}
}

const mapStateToProps = (store) => {
	return {
		user: store.user,
		onlineUsers: store.group.userList
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({loadUserData}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (GroupInfo)

// const GroupInfoContainer = connect((store) => ({
// 	user: store.user,
// 	onlineUsers: store.group.userList
// }), {}) (GroupInfo)

// export default GroupInfoContainer
