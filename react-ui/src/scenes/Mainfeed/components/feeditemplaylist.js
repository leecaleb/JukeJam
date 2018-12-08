import React from 'react'
import {getPlaylist} from '../../../server'
import MainFeedSongDisplay from './mainfeedsongdisplay'

export default class FeedItemPlaylist extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			playlist: [],
			youtube: [],
			spotify: [],
			songs: []
		}
	}

	componentDidMount() {
		getPlaylist(this.props.feedItemId, (playlist) => {
			this.setState({ playlist: playlist })
		})
	}

	updatePlaylist() {
		var playlistArr = []
		var spotify = this.state.songs.spotify
		var youtube = this.state.songs.youtube
		var songid = 0
		for(var i = 0; i < spotify.length; ++i) {
			for(var j = songid; j < this.state.spotify.length; ++j) {
				if(spotify[i]._id === this.state.spotify[j].id) {
					playlistArr[spotify[i].index] = this.state.spotify[j]
					songid++
					break
				}
			}
		}
		songid = 0
		for(i = 0; i < youtube.length; ++i) {
			for(j = songid; j < this.state.youtube.length; ++j) {
				if(youtube[i]._id === this.state.youtube[j].id) {
					playlistArr[youtube[i].index] = this.state.youtube[j]
					songid++
					break
				}
			}
		}

		this.setState({
			playlist: playlistArr
		})
	}

	render() {
		return (
			<div className="mainfeedsongdisplay">
				<ul className="list-group">
					{this.state.playlist.map((song) => {
						return (
							<MainFeedSongDisplay
								key={song.id}
								data={song}/>
						)
					})}
				</ul>
			</div>
		)
	}
}
