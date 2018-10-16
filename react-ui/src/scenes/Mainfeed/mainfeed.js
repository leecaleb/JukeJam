import React from 'react'
import FeedItem from './components/feeditem'
import ErrorBanner from '../../components/errorbanner'
import SideBar from './components/sidebar'
import {getFeedData} from '../../server'
// import { connect } from 'react-redux'
// import { getPlaylist } from '../actions/index'

class MainFeed extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			contents: []
		}
	}

	componentWillMount() {
		getFeedData(this.props.user, (feedData) => {
			this.setState(feedData)
		})
	}

	handleClick() {
		this.sidebar.likeButton()
	}

	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<ErrorBanner />
						</div>
					</div>
					<div className="col-md-10" id="main">
						{this.state.contents.map((feedItem) => {
							return (
								<FeedItem key={feedItem._id} user={this.props.user} data={feedItem} clicked={this.handleClick.bind(this)}/>
							)
						})}
					</div>
					<div className="col-md-2 side-bar">
						<SideBar user={this.props.user} onRef={ref => this.sidebar = ref} />
					</div>
				</div>
			</div>
		)
	}
}

// const mapDispatchToProps = dispatch => ({
//   dispatch: () => {
//     dispatch(getPlaylist())
//   }
// })

// const MainFeedContainer = connect((store) => ({
//   feedData: store.feedData.feedData
// }), {}) (MainFeed)
//
export default MainFeed
