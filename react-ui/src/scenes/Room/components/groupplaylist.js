import React from 'react'
import SongDisplay from './songdisplay'
import PlayingSongDisplay from './playingsongdisplay'
import { getPlaylist } from '../../../server'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadPlaylist, playNext } from '../../../actions/index'

class GroupPlaylist extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			playlist: [],
			youtube: [],
			spotify: [],
			songs: [],
			playing: false,
			startPlay: false,
			playing_song: [],
			next_song: []
		}
		this.handleScroll = this.handleScroll.bind(this)
	}

	componentDidMount() {
		document.getElementById('song-queue').addEventListener('wheel', (e) => {
			this.handleScroll(e)
		})
		this.props.onRef(this)
		this.updatePlaylist()
	}

	handleScroll(e) {
		e.preventDefault
		var ele = document.getElementById('song-queue')

		if (e.deltaY < 0) { //scrolling up
			ele.scrollBy(-8, 0)
		}

		if (e.deltaY > 0) { //scrolling down
			ele.scrollBy(8, 0)
		}
	}

	// action: 1 if song added and 0 if song removed
	refresh(song, action) {
		var newArr = this.state.next_song
		if(action) {
			newArr.push(song.tracks[0])
		} else {
			var index = newArr.map((song) => song.id).indexOf(song.tracks[0].id)
			if(index > -1) {
				newArr.splice(index, 1)
			}
		}
		this.setState({
			next_song: newArr
		})
	}

	refreshForYoutube(song, action) {
		var newArr = this.state.next_song
		if (action) {
			newArr.push(song[0])
		} else {
			var index = newArr.map((song) => song.id).indexOf(song[0].id)
			if (index > -1) {
				newArr.splice(index, 1)
			}
		}
		this.setState({
			next_song: newArr
		})
	}

	updatePlaylist() {
		getPlaylist(this.props.groupId, (playlist) => {
			var selected_id = this.props.group.selected_id
			if (playlist.length) {
				this.props.loadPlaylist([playlist[selected_id]], playlist.slice(selected_id+1, playlist.length))
			}
		})
	}

	handlePlay() {
		if(!this.state.startPlay) {
			this.setState({
				startPlay:true
			})
		}

		this.setState({
			playing: true
		}, () => {
			this.playsong.handlePlay()
		})
	}

	handlePause() {
		this.setState({
			playing: false
		}, this.playsong.handlePause())
	}

	async playNextSong () {
		await this.props.playNext([this.props.group.playlist[0]])
		this.handlePlay()
	}

	buildChildren (song) {
		if (song != null) {
			return (
				<div key={song.id} className="songdisplay">
					<SongDisplay
						data={song}
						songId={song.id}
						groupId={this.props.groupId} />
				</div>
			)
		}
	}

	render() {
		// console.log(this.props.group)
		let cur_song = []
		if (this.props.group.currentSong[0] !== null) {
			cur_song = this.props.group.currentSong
		}
		return (
			<div>
				{cur_song.map((song) => {
					return (
						<PlayingSongDisplay
							key={0}
							data={song}
							songId={song.id}
							groupId={this.props.groupId}
							playNextSong={this.playNextSong.bind(this)}
							startPlay={this.state.startPlay}
							onRef={ref => this.playsong = ref} />
					)
				})}
				<div className="container-fluid song-queue" id="song-queue"
					onMouseOver={() => document.documentElement.style.overflowY = 'hidden'}
					onMouseOut={() => document.documentElement.style.overflowY = 'auto'}>
					{this.props.group.playlist.map(this.buildChildren.bind(this))}
				</div>
			</div>

		)
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({ loadPlaylist, playNext }, dispatch)
	}
}

const mapStateToProps = (store) => {
	return {
		group: store.group
	}
}

export default connect(mapStateToProps, mapDispatchToProps) (GroupPlaylist)