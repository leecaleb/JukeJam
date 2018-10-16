import React from 'react'
import ReactAudioPlayer from 'react-audio-player'
import Youtube from 'react-youtube'
import {addSong, removeSong,  getPlaylist} from '../../../server'

export default class SongDisplay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			playing: false,
			songList: [],
			songIdList: [],
			selectedSong: [],
			songId: []
		}
	}

	componentDidMount() {
		getPlaylist(this.props.groupId, (playlist) => {
			this.setState({songList: playlist}, () => {
				this.setState({
					songIdList: this.state.songList.map((obj) => {
						return(obj.id)
					}),
					selectedSong: this.props.selectedSong,
					songId: this.props.songId
				})
			})
		})
	}

	handleAdd() {
		addSong(this.props.groupId, this.props.songId, (updatedSongList) => {
			this.setState({songList: updatedSongList})
		})
		this.props.handleGroupPlaylist()
	}

	handleRemove() {
		removeSong(this.props.groupId, this.props.songId, (updatedSongList) => {
			this.setState({songList: updatedSongList})
		})
		this.props.handleGroupPlaylist()
	}

	added() {
		var found = false
		for(var i = 0; i < this.state.songIdList.length; i++) {
			if(this.state.songIdList[i] === this.props.data.id) {
				found = true
				break
			}
		}
		return found
	}

	playNext() {
		this.props.playNext()
	}

	render() {
		var addButton = []

		if(this.added()) {
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

		const opts = {
			height: '300',
			width: '300',
			playerVars: {
				controls: 0,
				showinfo: 0,
				modestbranding: 1,
				rel: 0
			}
		}

		var display = []
		if(this.props.data.type == null) {
			display = (
				<div className="group-playlist">
					<Youtube
						opts={opts}
						videoId={this.props.data.id}
					/>
				</div>
			)
		} else {
			display = (
				<div className="group-playlist">
					<img src={this.props.data.album.images[0].url} alt="no album cover found :(" />
					<ReactAudioPlayer
						onEnded = {this.playNext.bind(this)}
						src = {this.props.data.preview_url}
						ref = {(e) => {this.song = e}}
					/>
				</div>
			)
		}

		return(
			<div>
				{display}
			</div>
		)
	}
}
