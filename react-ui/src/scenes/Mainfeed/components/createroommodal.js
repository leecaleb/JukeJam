import React from 'react'
import { createRoom } from '../../../server'
import { addRoomToUserGroups } from '../../../actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class CreateRoomModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			roomName: '',
			potentialFriendlist: this.props.user.userData.friends,
			friendsToAdd: [],
			showFriendlist: false,
			mouseOverId: ''
		}
	}
    
	handleOnCreate() {
		if (this.state.roomName === '') {
			document.getElementById('room-name-input').style.borderColor = 'red'
			document.getElementById('room-name-input').placeholder = 'Please name your new room'
		} else {
			createRoom(this.props.user_id, this.state.roomName, this.state.friendsToAdd, (room_id) => {
				document.getElementById('create-room-class').style.display = 'none'
				// redirect page to newly created room
				this.props.addRoomToUserGroups(room_id)
				this.props.handleUpdateFeed()
				window.location.href = process.env.NODE_ENV === 'development' ?
					'http://localhost:3000/group/' + room_id : 'https://jukejam.hirecaleblee.me/group/' + room_id
			})
		}
	}

	handleCancelCreateRoom() {
		document.getElementById('create-room-class').style.display = 'none'
	}
    
	handleNameTyped(e) {
		e.preventDefault()
		this.setState({ roomName: e.target.value })
	}

	handleFriendSearch(e) {
		e.preventDefault()
		if (e.target.value === '') {
			this.setState({ potentialFriendlist: this.props.user.userData.friends })
		} else {
			var filtered = this.props.user.userData.friends.filter((user) => {
				return user.fullName.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1
			})
			this.setState({ potentialFriendlist: filtered })
		}
	}

	handleAddFriend(friend) {
		var updatedList = this.state.friendsToAdd
		updatedList.push(friend)
		this.setState({ friendsToAdd: updatedList})
	}

	onFocus() {
		this.setState({
			showFriendlist: true
		})
	}

	handleMouseEnter(friendId) {
		this.setState({mouseOverId: friendId})
	}

	handleMouseLeave() {
		this.setState({mouseOverId: ''})
	}

	handleOnUnselect(friend) {
		var updatedList = this.state.friendsToAdd
		updatedList = updatedList.filter(obj => obj._id !== friend._id)
		this.setState({ friendsToAdd: updatedList})
	}
    
	render() {
		return (
			<div>
				<div className="container-fluid col-xs-12" id="create-room-class">
					<div className="panel panel-default" id="create-room-modal">
						<div className="panel-body">
							<b id="create-room-modal-header">Create a new room and add your friends</b>
							<div className="input-group" id="create-room-input">
								<h5><b>Name</b></h5>
								<br />
								<input
									type="text"
									className="form-control"
									id="room-name-input"
									placeholder="Room Name"
									aria-describedby="basic-addon1"
									onChange={(e) => this.handleNameTyped(e)}/>
								<br/><h5><b>Find and add friends</b></h5>
								<br />
								<input
									type="text"
									className="form-control"
									placeholder="Start typing"
									aria-describedby="basic-addon1"
									onFocus={() => this.setState({ showFriendlist: true })}
									onBlur={() => this.setState({showFriendlist: false })}
									onKeyUp={(e) => this.handleFriendSearch(e)}/>
							</div>
							{this.state.showFriendlist ?
								<div className="friend-search-result">
									<ul className="list-group">
										{this.state.potentialFriendlist.map((friend) => {
											return (
												<li key={friend._id} className="list-group-item" id="friend-list-item" onMouseDown={() => this.handleAddFriend(friend)}>
													{friend.fullName}
												</li>
											)
										})}
									</ul>
								</div> : null}
							<div className="friends-to-add">
								{this.state.friendsToAdd.map((friend) => {
									return (
										<div
											key={friend._id}
											className="btn-default friend-to-add"
											onMouseEnter={() => this.handleMouseEnter(friend._id)}
											onMouseLeave={() => this.handleMouseLeave()}
											onClick={() => this.handleOnUnselect(friend)}>
											{this.state.mouseOverId === friend._id ? 'Delete' : friend.fullName}
										</div>
									)
								})}
							</div>
							<button className="btn btn-default" id="create-room-btn" onClick={() => this.handleCancelCreateRoom()}>
								Cancel
							</button>
							<button className="btn btn-default" id="create-room-btn" onClick={() => this.handleOnCreate()}>
								Create Room
							</button>
						</div>
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

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({addRoomToUserGroups}, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (CreateRoomModal)