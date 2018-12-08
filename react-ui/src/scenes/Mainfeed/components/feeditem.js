import React from 'react'
import {Link} from 'react-router'
import {likeFeedItem, unlikeFeedItem, getPlaylist} from '../../../server'
import FeedItemPlaylist from './feeditemplaylist'

export default class FeedItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			playlist: [],
			likerList: [],
			scrollLeft: 0
		}
	}

	componentWillMount() {
		getPlaylist(this.props.data._id, (playlist) => {
			this.setState({
				playlist: playlist,
				likerList: this.props.data.likerList
			})
		})
	}

	handleLikeClick(clickEvent) {
		clickEvent.preventDefault()
		if (clickEvent.button === 0) {
			likeFeedItem(this.props.data._id, this.props.user, (updatedLikeCounter) => {
				this.setState({ likerList: updatedLikeCounter }, () => {
					this.props.clicked()
				})
			})
		}
	}

	handleUnlikeClick(clickEvent) {
		clickEvent.preventDefault()
		if (clickEvent.button === 0) {
			unlikeFeedItem(this.props.data._id, this.props.user, (updatedLikeCounter) => {
				this.setState({ likerList: updatedLikeCounter }, () => {
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

		for (var i = 0; i < likes.length; i++) {
			if (likes[i]._id === this.props.user) {
				liked = true
				break
			}
		}
		return liked
	}

	scrollRight() {
		this.setState({
			scrollLeft: this.state.scrollLeft - 1
		})
		var ele = document.getElementById(this.props.data._id)
		ele.scrollLeft += 193
	}

	scrollLeft() {
		this.setState({
			scrollLeft: this.state.scrollLeft + 1
		})
		var ele = document.getElementById(this.props.data._id)
		ele.scrollLeft -= 193
	}

	render() {
		var likeButton = []
		var clicked = this.didUserLike()

		if(clicked) {
			likeButton.push (
				<button type="button" className="btn btn-default" id="like-button" key={1} onClick={(e) => this.handleUnlikeClick(e)}>
					<span className="glyphicon glyphicon-heart-empty" id="heart" aria-hidden="true"></span>
				</button>
			)
		} else {
			likeButton.push (
				<button type="button" className="btn btn-default" id="like-button" key={2} onClick={(e) => this.handleLikeClick(e)}>
					<span className="glyphicon glyphicon-heart-empty" id="unclicked" aria-hidden="true"></span>
				</button>
			)
		}

		return (
			<div>
				<div className="container-fluid" style={{ backgroundColor: 'transparent', margin: '30px auto', color: 'white', position: 'relative' }}>
					{this.state.scrollLeft ?
						<div className="scroll-left">
							<button className="btn-default scroll-button" onClick={() => this.scrollLeft()}>
								<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
							</button>
						</div> : null}
					
					{this.state.playlist.length > 5 ? 
						<div className="scroll-right">
							<button className="btn-default scroll-button" onClick={() => this.scrollRight()}>
								<span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
							</button>
						</div> : null}
					<div className="row">
						<div className="col-md-12">
							<h3 className="group-header">
								<b><Link to={'/group/' + this.props.data._id}>{this.props.data.groupName}</Link></b>
								<small> by <Link to={'/profile/' + this.props.data.author._id}>{this.props.data.author.fullName}</Link></small> {likeButton}</h3>
							<hr style={{ margin: '7px 0 0 0' }} />
						</div>
					</div>
					<div className="feedItemPlaylist" id={this.props.data._id}>
						{this.state.playlist.length ?
							this.state.playlist.map((song) => {
								if (song.kind) {
									return (
										<div className="feedItemSong"
											key={song.id}
											style={{
												margin: '10px 10px 0 0',
												backgroundImage: 'url(' + song.snippet.thumbnails.default.url + ')'
											}}>
										</div>
									)
								} else {
									return (
										<div className="feedItemSong"
											key={song.id}
											style={{
												margin: '10px 10px 0 0',
												backgroundImage: 'url(' + song.album.images[0].url + ')'
											}}>
										</div>
									)
								}
							}) :
							<div className="feedItemSong"
								key={0}
								style={{
									margin: '10px 10px 0 0',
									backgroundColor: 'black'
								}}>
								<h2><b>No song has been added yet</b></h2>
							</div>}
					</div>
				</div>				
			</div>
		)
	}
}
