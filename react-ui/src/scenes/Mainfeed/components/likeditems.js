import React from 'react'
import {Link} from 'react-router'

export default class LikedItems extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.data
	}

	render() {
		return(
			<div>
				<div className="media">
					<div className="media-left">
						<Link to={'/group/' + this.state._id}>
							<div className="side-object-thumb"
								style={{
									backgroundImage: 'url(' + this.state.thumbnail + ')'
								}}>
							</div>
						</Link>
					</div>
					<div className="media-body">
						<h5 className="media-heading"><Link to={'/group/' + this.state._id}>{this.state.groupName}</Link></h5>
						<p>by <Link to={'/profile/' + this.state.author._id}>{this.state.author.fullName}</Link><br />
							6 days ago<br/>
							126,403 views
						</p>
					</div>
				</div>
			</div>
		)
	}
}
