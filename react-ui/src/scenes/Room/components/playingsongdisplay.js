import React from 'react'
import ReactAudioPlayer from 'react-audio-player'
import Youtube from 'react-youtube'
import {addSong, removeSong, getLyrics} from '../../../server'

export default class PlayingSongDisplay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			playing: false,
			songList: [],
			songIdList: [],
			songId: [],
			player_ready: false
		}
	}

	componentDidMount() {
		this.props.onRef(this)
	}

	handlePlay() {
		// if (this.props.data.type == null) { //youtube
		// 	getLyrics('y', this.props.data.snippet.title.toString(), this.props.data.snippet.channelTitle.toString(), (lyrics) => {
		// 		console.log(lyrics.lyrics_body)
		// 	})
		// } else { // spotify
		// 	getLyrics('s', this.props.data.name.toString(), this.props.data.artists[0].name.toString(), (lyrics) => {
		// 		console.log(lyrics.lyrics_body)
		// 	})
		// }
		
		if(this.props.data.type == null){
			this.setState({
				playing: true
			}, () => {
				if (this.state.player_ready) {
					document.getElementById('youtube-player-' + this.props.data.id).contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
				}
			})
		} else {
			this.setState({
				playing: true
			}, () => {
				this.song.audioEl.play()
			})
		}
	}

	handlePause() {
		if(this.props.data.type == null){
			this.setState({
				playing: false
			}, document.getElementById('youtube-player-' + this.props.data.id).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'))
			// this.song.target.pauseVideo();
		} else {
			this.setState({playing: false})
			this.song.audioEl.pause()
		}
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

	playNextSong() {
		this.props.playNextSong()
	}

	onReady(e) {
		this.setState({
			player_ready: true
		}, () => {
			// e.target.playVideo()
			if(!this.props.startPlay) {
				e.target.pauseVideo()
			}
		})
	}

	render() {
		var playButton = []

		const opts = {
			height: '100%',
			width: '100%',
			playerVars: {
				controls: 0,
				showinfo: 0,
				modestbranding: 1,
				rel: 0,
				autoplay: 1
			}
		}

		var album_cover = []

		if(this.state.playing){
			playButton.push(
				<button className="btn btn-default" type="button" key={0} id="searchPlayButton" onClick={this.handlePause.bind(this)}>
					<span className="glyphicon glyphicon-pause" aria-hidden="true"></span>
				</button>
			)
		} else {
			playButton.push(
				<button className="btn btn-default" type="button" key={1} id="searchPlayButton" onClick={this.handlePlay.bind(this)}>
					<span className="glyphicon glyphicon-play" aria-hidden="true"></span>
				</button>
			)
		}

		if(this.props.data.type == null) { //youtube
			album_cover = (
				<div className="group-playlist playingsongdisplay" id="playing-youtube" key={this.props.songId}>
					<div className="playing-container">
						<Youtube
							id={'youtube-player-'+ this.props.data.id}
							opts={opts}
							videoId={this.props.data.id}
							onEnd={this.playNextSong.bind(this)}
							onReady={this.onReady.bind(this)}
						/>
						<div className="player-controller">
							<div className="col-md-1" id="btn-container">
								<button className="btn btn-default" type="button" id="upvote" key={0}>
									<span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
								</button>
							</div>
							<div className="col-md-10">
								<div className="row player-header">
									<div className="col-md-1" style={{ paddingRight: 0 }}>
										{playButton}
									</div>
									<div className="col-md-11">
										<h3 style={{ marginTop: 11, marginLeft: 0 }}>{this.props.data.snippet.title.toString() + ' '}</h3>
									</div>
								</div>
								<p style={{ paddingLeft: 15, marginTop: 8 }}>by {this.props.data.snippet.channelTitle.toString()}</p>
							</div>
							<div className="col-md-1" id="btn-container">
								<button className="btn btn-default" type="button" id="downvote" key={1}>
									<span className="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)
		} else { //spotify
			album_cover = (
				<div className="group-playlist playingsongdisplay" id="playing-spotify" key={this.props.songId}>
					<div className="playing-container">
						<img src={this.props.data.album.images[0].url} alt="no album cover found :(" />
						<ReactAudioPlayer
							onEnded = {this.playNextSong.bind(this)}
							src = {this.props.data.preview_url}
							ref = {(e) => {this.song = e}}
						/>
						<div className="player-controller">
							<div className="col-md-1" id="btn-container">
								<button className="btn btn-default" type="button" id="upvote" key={0}>
									<span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
								</button>
							</div>
							<div className="col-md-10">
								<div className="row player-header">
									<div className="col-md-1" style={{ paddingRight: 0 }}>
										{playButton}
									</div>
									<div className="col-md-11">
										<h3 style={{ marginTop: 11, marginLeft: 0 }}>{this.props.data.name.toString() + ' '}</h3>
									</div>
								</div>
								<p style={{ paddingLeft: 15, marginTop: 8 }}>{this.props.data.artists[0].name.toString()} · {this.props.data.album.name.toString()}</p>
							</div>
							<div className="col-md-1" id="btn-container">
								<button className="btn btn-default" type="button" id="downvote" key={1}>
									<span className="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)
		}

		return(
			<div>
				{album_cover}
			</div>
		)
	}
}
