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

	render() {

		var display = []
		if (this.props.data.type == null) {
			display = (
				<div className="group-playlist">
					<img src={this.props.data.snippet.thumbnails.high.url} id="youtube-thumbnail" alt="no album cover found :(" />
				</div>
			)
		} else {
			display = (
				<div className="group-playlist">
					<img src={this.props.data.album.images[0].url} alt="no album cover found :(" />
				</div>
			)
		}

		return (
			<div style={{ height: '100%'}}>
				{display}
			</div>
		)
	}
}
