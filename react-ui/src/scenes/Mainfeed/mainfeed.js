import React from 'react'
import FeedItem from './components/feeditem'
import ErrorBanner from '../../components/errorbanner'
import SideBar from './components/sidebar'
import {getFeedData, addFriend} from '../../server'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {addMarkToRedux} from '../../actions/index'

class MainFeed extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			contents: [],
			hasFriends: this.props.user_redux.friends.length
		}
		this.handleAddMark = this.handleAddMark.bind(this)
	}

	componentDidMount() {
		if (!this.state.hasFriends) {
			document.getElementById('mainfeed-body').style.opacity = 0.2
		}
		this.getFeed()
	}

	getFeed() {
		getFeedData(this.props.user, (feedData) => {
			this.setState({
				contents: feedData.contents
			})
		})
	}

	handleClick() {
		this.sidebar.likeButton()
	}

	handleAddMark() {
		addFriend(this.props.user, '000000000000000000000004', (user) => {
			this.props.addMarkToRedux(user)
			document.getElementById('mainfeed-body').style.opacity = 1
			this.setState({hasFriends: 1}, () => this.getFeed())
		})
	}

	render() {
		return (
			<div>
				{this.state.hasFriends ? 
					null
					:<div className="panel panel-default" id="no-friend-modal">
						<div className="panel-body">
							This is much more fun if you use it with friends. Add Mark to test this out!
						</div>
						<div className="panel-body">
							<div className="media" style={{width:180, margin: 'auto'}}>
								<div className="media-left">
									<a href="#" className="thumbnail" id="modal-thumb">
										<img src="https://images.unsplash.com/photo-1515536765-9b2a70c4b333?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e28f973699b9805ba500348e3ecdc38a&auto=format&fit=crop&w=1576&q=80" />
									</a>
								</div>
								<div className="media-body" style={{padding:3}}>
									<h4 className="media-heading" style={{ color: 'gray',margin:0 }}>Mark</h4>
									<p style={{fontSize: 12, margin:3}}>Amherst, MA</p>
									<button type="button" className="btn btn-default" onClick={this.handleAddMark}>
										Add Mark
									</button>
								</div>
							</div>
						</div>
					</div>}
				<div className="container-fluid mainfeed-body" id="mainfeed-body">
					<div className="row">
						<div className="col-md-12">
							<ErrorBanner />
						</div>
					</div>
					<div className="col-md-9" id="main">
						{this.state.contents.map((feedItem) => {
							return (
								<FeedItem key={feedItem._id} user={this.props.user} data={feedItem} clicked={this.handleClick.bind(this)}/>
							)
						})}
					</div>
					<div className="col-md-3 side-bar">
						<SideBar user={this.props.user} onRef={ref => this.sidebar = ref} />
					</div>
				</div>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({addMarkToRedux}, dispatch)
	}
}

const mapStateToProps = (state) => {
	return {
		user_redux: state.user
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (MainFeed)
