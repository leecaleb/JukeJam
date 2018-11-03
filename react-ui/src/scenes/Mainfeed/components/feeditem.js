import React from 'react'
import {Link} from 'react-router'
import {likeFeedItem, unlikeFeedItem} from '../../../server'
import FeedItemPlaylist from './feeditemplaylist'

export default class FeedItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = props.data
	}

	handleLikeClick(clickEvent) {
		clickEvent.preventDefault()
		if (clickEvent.button === 0) {
			likeFeedItem(this.state._id, this.props.user, (updatedLikeCounter) => {
				this.setState({likerList: updatedLikeCounter}, () => {
					this.props.clicked()
				})
			})
		}
	}

	handleUnlikeClick(clickEvent) {
		clickEvent.preventDefault()
		if (clickEvent.button === 0) {
			unlikeFeedItem(this.state._id, this.props.user, (updatedLikeCounter) => {
				this.setState({likerList: updatedLikeCounter}, () => {
					this.props.clicked()
				})
			})

		}
	}

	/**
   * Returns 'true' if the user liked the item.
   * Returns 'false' if the user has not liked the item.
   */
	didUserLike() {
		var likes = this.state.likerList
		var liked = false
		// Look for a likeCounter entry with userId 4 -- which is the
		// current user.
		for (var i = 0; i < likes.length; i++) {

			if (likes[i]._id === this.props.user) {
				liked = true
				break
			}
		}
		return liked
	}

	auth() {
		var authorized = false
		for(var i = 0; i < this.state.groupUsers.length; i++){
			if(this.state.groupUsers[i]._id === this.props.user){
				authorized = true
				break
			}
		}
		return authorized
	}

	render() {
		var likeButton = []
		var clicked = this.didUserLike()
		// console.log(clicked)
		if(clicked) {
			likeButton.push (
				<button type="button" className="btn btn-default" key={1} onClick={(e) => this.handleUnlikeClick(e)}>
					<span className="glyphicon glyphicon-heart-empty" id="heart" aria-hidden="true"></span>
				</button>
			)
		} else {
			likeButton.push (
				<button type="button" className="btn btn-default" key={2} onClick={(e) => this.handleLikeClick(e)}>
					<span className="glyphicon glyphicon-heart-empty" id="unclicked" aria-hidden="true"></span>
				</button>
			)
		}
		// console.log(this.state.author)
		// <img src={this.state.author.img} style={{width: '50%'}}/>
		return (
			<div>
				<div className="jumbotron">
					<div className="container">
						<div className="row">
							<div className="col-md-6 feeditem">
								<a href="#" className="thumbnail group3">
									{/* <button type="button" className="btn btn-default btn-left">
										<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
									</button>

									<button type="button" className="btn btn-default btn-right">
										<span className="glyphicon glyphicon-chevron-right" aria-hidden="true" />
									</button> */}
								</a>
								<div className="btn-group" role="group">
									{likeButton}
									<button type="button" className="btn btn-default">
										<span className="glyphicon glyphicon-retweet" aria-hidden="true"></span>
									</button>
									<button type="button" className="btn btn-default">
										<span className="glyphicon glyphicon-send" aria-hidden="true"></span>
									</button>
									<button type="button" className="btn btn-default">
										<span className="glyphicon glyphicon-flag" aria-hidden="true"></span>
									</button>
								</div>
							</div>
							{this.auth() ?
								<div className="col-md-6">
									<div className="panel panel-default group-content">
										<div className="panel-heading group-header">
											<h2 className="panel-title"><b><Link to={'/group/' + this.state._id}>{this.state.groupName}</Link></b>
												<small> by <Link to={'/profile/' + this.state.author._id}>{this.state.author.fullName}</Link></small></h2>
										</div>
										<FeedItemPlaylist length={this.state.songs.length} feedItemId={this.state._id}/>
									</div>
								</div>
								: <div className="col-md-8">
									<div className="panel panel-default group-content">
										<div className="panel-heading group-header">
											<h2 className="panel-title"><b><Link to={'/group/' + this.state._id + '/' + this.state.groupName}>{this.state.groupName}</Link></b>
												<small> by <Link to={'/profile/' + this.state.author._id}>{this.state.author.fullName}</Link></small></h2>
										</div>
										<FeedItemPlaylist length={this.state.songs.length} feedItemId={this.state._id}/>
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
