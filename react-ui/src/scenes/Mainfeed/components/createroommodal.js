import React from 'react'
import {createRoom} from '../../../server'

export default class CreateRoomModal extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			roomName: ''
		}
	}
    
	handleOnCreate() {
		createRoom(this.props.user_id, this.state.roomName, (room_id) => {
			document.getElementById('mainfeed-body').style.opacity = 1
			// redirect page to newly created room
		})
	}
    
	handleTextChange(e) {
		e.preventDefault()
		this.setState({roomName: e.target.value})
	}
    
	render() {
		return (
			<div>
				<div class="panel panel-default" id="create-room-modal">
					<div class="panel-body">
                        Basic panel example
					</div>
				</div>
			</div>
		)
	}
}