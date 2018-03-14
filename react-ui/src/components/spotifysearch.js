import React from 'react'
import SpotifySearchSongDisplay from './spotifysearchsongdisplay'
import {getPlaylist, searchSong} from '../server'


export default class SpotifySearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupPlaylist: [],
      searchText: "",
      searchRes: []
    }
  }

  handleTextChange(e) {
    e.preventDefault();
    this.setState({searchText: e.target.value});
  }

  handleSearch() {
    searchSong(this.state.searchText, (data) => {
      console.log(data);
      this.setState({searchRes: data.tracks.items});
    })
  }

  handleOnKeyUp(e) {
    e.preventDefault();
    // if(this.searchText !== "") {
    //   this.handleSearch();
    // }
    if(e.key === "Enter") {
      this.handleSearch();
    }
  }

  handleGroupPlaylist(songId) {
    this.props.handleGroupPlaylist(songId);
    // console.log("searchText: " + this.state.searchText);
    // searchSong(this.state.searchText, (data) => {
    //   console.log(data);
    //   this.setState({searchRes: data.tracks.items});
    // })
  }

  switchToSpotify() {
    this.props.switchToSpotify();
  }

  switchToYoutube() {
    this.props.switchToYoutube();
  }

  render() {
    return (
      <div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12 login-button">
              <button type="button" className="btn login-button spotify-login-button" id="active" onClick={this.switchToSpotify.bind(this)}/>
              <button type="button" className="btn login-button youtube-login-button" onClick={this.switchToYoutube.bind(this)}/>
            </div>
          </div>
          <div className="input-group" id="song-search-bar">
            <input type="text" className="form-control" placeholder="Search for..."
              onChange={(e) => this.handleTextChange(e)}
              onKeyUp={(e) => this.handleOnKeyUp(e)}/>
            <span className="input-group-btn">
              <button className="btn btn-default" type="button" onClick={this.handleSearch.bind(this)}>Go!</button>
            </span>
          </div>
          <div id="searchResult">
            {this.state.searchRes.map((song) => {
              return(
                <SpotifySearchSongDisplay
                  key={song.id}
                  data={song}
                  songId={song.id}
                  groupId={this.props.groupId}
                  handleGroupPlaylist={this.handleGroupPlaylist.bind(this)}/>
              )
            })}
          </div>
        </div>
      </div>

    )
  }
}
