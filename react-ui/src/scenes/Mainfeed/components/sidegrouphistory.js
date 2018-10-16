import React from 'react'
import {getGroupHistory} from '../../../server'
import GroupHistory from './grouphistory'


export default class SideGroupHistory extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			groupHistory: []
		}
	}

	componentDidMount() {
		getGroupHistory(this.props.user, (historyData) => {
			this.setState({groupHistory: historyData})
		})
	}

	render() {
		return(
			<div>
				<div className="panel">
					<div className="panel-heading">
						<h2 className="panel-title">History</h2>
					</div>
					{this.state.groupHistory.map((groupItem) =>{
						return (
							<GroupHistory key={groupItem._id} data={groupItem} />
						)
					})}
				</div>
			</div>
		)
	}
}
