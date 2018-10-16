import React from 'react'
import Youtube from 'react-youtube'
import {addYoutubeSong} from '../../../server'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addNewSong } from '../../../actions/index'

class YoutubePlayer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			songidlist: []
		}
	}

	componentDidMount() {
	}

	handleAdd() {
		addYoutubeSong(this.props.groupId, this.props.videoId, (addedsonginfo) => {
			this.props.addNewSong(addedsonginfo[0])
			this.props.handleGroupPlaylist(addedsonginfo, 1)
		})
	}

	handleRemove() {

	}

	added() {
		var found = false
		for(var i = 0; i < this.state.songidlist.length; ++i) {
			if(this.state.songidlist[i] === this.props.videoId){
				found =  true
				break
			}
		}
		return found
	}

	render() {
		const opts = {
			height: '100',
			width: '100',
			playerVars: {
				controls: 0,
				showinfo: 0,
				modestbranding: 1,
				rel: 0
			}
		}

		window.YTConfig = {
			host: 'https://www.youtube.com'
		}

		var addButton = []
		if(this.props.included) {
			addButton.push(
				<small key={1}><button className="btn btn-xs" type="button"
					id="addButton"
					onClick={this.handleRemove.bind(this)}>
					<span className="glyphicon glyphicon-ok-sign" id="added" aria-hidden="true"></span>
				</button></small>
			)
		} else {
			addButton.push(
				<small key={2}><button className="btn btn-xs" type="button"
					id="addButton"
					onClick={this.handleAdd.bind(this)}>
					<span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>
				</button></small>
			)
		}

		return(
			<div>
				<div className="media" id="song-display">
					<div className="media-left">
						<Youtube
							opts={opts}
							videoId={this.props.videoId}
						/>
					</div>
					<div className="media-body">
						<h3 className="media-heading">{this.props.title + ' '}</h3>{addButton}
						<p>by {this.props.channelTitle}</p>
					</div>
				</div>
			</div>
		)
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({addNewSong}, dispatch)
	}
}
const SongDisplayContainer = connect(() => ({}), mapDispatchToProps) (YoutubePlayer)
export default SongDisplayContainer
