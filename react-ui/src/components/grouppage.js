import React from 'react'
import {Link} from 'react-router'
import {getGroupData} from '../server'

export default class GroupPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			groupInfo: [],
			groupUsers: []
		}
	}

	componentDidMount() {
		getGroupData(this.props.groupId, (group) => {
			this.setState({
				groupInfo: group,
				groupUsers: group.groupUsers
			})
		})
	}

	render() {
		return (
			<div>
				<div className="container usersList">
					<div className="row">
						<h1>{this.state.groupInfo.groupName}</h1>
						<div>
							{this.state.groupUsers.map((user) => {
								return(
									<Link to={'/profile/' + user._id} key={user._id}><div id="userThumb">{user.fullName}</div></Link>
								)
							})}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
					</div>
				</div>
			</div>
		)
	}
}
