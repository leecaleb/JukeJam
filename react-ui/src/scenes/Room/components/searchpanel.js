import React from 'react'
import SpotifySearchSongDisplay from './spotifysearchsongdisplay'
import YoutubePlayer from './youtubeplayer'
import {getGroupData, searchSong, searchYoutube} from '../../../server'

export default class SearchPanel extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			groupPlaylist: [],
			searchText: '',
			searchRes: [],
			spotify_search: false,
			youtube_list: [],
			spotify_list: []
		}
		this.switchToSpotify = this.switchToSpotify.bind(this)
		this.switchToYoutube = this.switchToYoutube.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.handleGroupPlaylist = this.handleGroupPlaylist.bind(this)
	}

	componentDidMount () {
		getGroupData(this.props.groupId, (group) => {
			this.setState({
				youtube_list: group.songs.youtube.map((song) => song._id),
				spotify_list: group.songs.spotify.map((song) => song._id)
			})
		})
	}

	handleTextChange(e) {
		e.preventDefault()
		this.setState({searchText: e.target.value})
	}

	handleSearch () {
		if (this.state.spotify_search) {
			searchSong(this.state.searchText, (data) => {
				this.setState({searchRes: data.tracks.items})
			})
		} else {
			searchYoutube(this.state.searchText, (data) => {
				this.setState({searchRes: data})
			})
		}

	}

	handleOnKeyUp (e) {
		e.preventDefault()
		if(e.key === 'Enter') {
			this.handleSearch()
		}
	}

	handleGroupPlaylist (songId, action) {
		if (this.state.spotify_search) {
			let updated_list = this.state.spotify_list
			updated_list.push(songId.tracks[0].id)
			this.setState({
				spotify_list: updated_list
			})
		} else {
			let updated_list = this.state.youtube_list
			updated_list.push(songId[0].id)
			this.setState({
				youtube_list: updated_list
			})
		}
		// this.props.handleGroupPlaylist(songId, action, this.state.spotify_search);
	}

	switchToSpotify () {
		document.getElementById('search-body').style.display = 'block'
		document.getElementById('search-input').style.display = 'block'
		document.getElementById('search-enter-btn').style.display = 'block'
		this.setState({
			spotify_search: true,
			searchRes: []
		})
	}

	switchToYoutube () {
		document.getElementById('search-body').style.display = 'block'
		document.getElementById('search-input').style.display = 'block'
		document.getElementById('search-enter-btn').style.display = 'block'
		this.setState({
			spotify_search: false,
			searchRes: []
		})
	}

	render () {
		var song_display = []
		if (this.state.spotify_search) {
			song_display.push(
				<div key={0} id="searchResult">
					{this.state.searchRes.map((song) => {
						if (this.state.spotify_list.includes(song.id)) {
							return(
								<SpotifySearchSongDisplay
									key={song.id}
									data={song}
									songId={song.id}
									groupId={this.props.groupId}
									handleGroupPlaylist={this.handleGroupPlaylist}
									included={1}/>
							)
						} else {
							return(
								<SpotifySearchSongDisplay
									key={song.id}
									data={song}
									songId={song.id}
									groupId={this.props.groupId}
									handleGroupPlaylist={this.handleGroupPlaylist}
									included={0}/>
							)
						}
					})}
				</div>
			)
		} else {
			song_display.push(
				<div key={1} id="searchResult">
					{this.state.searchRes.map((song) => {
						if (this.state.youtube_list.includes(song.id.videoId)) {
							return(
								<YoutubePlayer
									key={song.id.videoId}
									videoId={song.id.videoId}
									title={song.snippet.title}
									channelTitle={song.snippet.channelTitle}
									groupId={this.props.groupId}
									handleGroupPlaylist={this.handleGroupPlaylist}
									included={1}/>
							)
						} else {
							return(
								<YoutubePlayer
									key={song.id.videoId}
									videoId={song.id.videoId}
									title={song.snippet.title}
									channelTitle={song.snippet.channelTitle}
									groupId={this.props.groupId}
									handleGroupPlaylist={this.handleGroupPlaylist}
									included={0}/>
							)
						}
					})}
				</div>
			)
		}
		return (
			<div className="col-md-9 search-panel">

				<div className="col-md-12 login-button search-btn">
					<button type="button" className="btn login-button spotify-login-button" onClick={this.switchToSpotify}/>
					<button type="button" className="btn login-button youtube-login-button" onClick={this.switchToYoutube}/>
				</div>

				<div className="input-group" id="song-search-bar">
					<input type="text" className="form-control" placeholder="Search for..."
						onChange={(e) => this.handleTextChange(e)}
						onKeyUp={(e) => this.handleOnKeyUp(e)}
						id="search-input"/>
					<span className="input-group-btn">
						<button className="btn btn-default" type="button" id="search-enter-btn" onClick={this.handleSearch}>Go!</button>
					</span>
				</div>

				<div className="panel-body" id="search-body">
					{song_display}
				</div>

			</div>
		)
	}
}
