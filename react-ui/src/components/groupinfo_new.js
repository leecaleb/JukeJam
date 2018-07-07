import React from 'react';
import {Link} from 'react-router';
import {getGroupData, getSong, addSong} from '../server'
import ReactAudioPlayer from 'react-audio-player'
import SongDisplay from './songdisplay'
import GroupPlaylist from './groupplaylist_new'
import SpotifySearch from './spotifysearch'
import YoutubeSearch from './youtubesearch'
import SearchPanel from './searchpanel'

export default class GroupInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: [],
      groupUsers: [],
      groupPlaylist: [],
      searching: false,
      spotify: true
    };
    this.searchPanelRef = this.searchPanelRef.bind(this);
    this.handleLeavePanel = this.handleLeavePanel.bind(this);
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleLeavePanel)
    getGroupData(this.props.groupId, (group) => {
      this.setState({
        groupInfo: group,
        groupUsers: group.groupUsers
      });
      // console.log("this.state.playlistLength: " + this.state.playlistLength);
    });


    // this.setState({spotify: true})
  }

  // <img key={user._id} src={user.img} />



  handleGroupPlaylist(songId, action) {
    this.playlist.refresh(songId, action);
  }

  handleGroupPlaylistYoutube(song) {
    // this.playlist.refreshForYoutube(song);
  }

  switchToSpotify() {
    this.setState({
      spotify: true,
      searching: true
    }, this.playlist.blur())
  }

  switchToYoutube() {
    this.setState({spotify: false})
  }

  searchPanelRef (node) {
    this.panelRef = node;
  }

  handleLeavePanel (e) {
    if(this.panelRef && !this.panelRef.contains(e.target)) {
      document.getElementById("search-body").style.display = "none";
      document.getElementById("search-input").style.display = "none";
      document.getElementById("search-enter-btn").style.display = "none";
    }
  }

  // <div className="input-group" id="song-search-bar">
  //   <input type="text" className="form-control" placeholder="Search for..."
  //     onChange={(e) => this.handleTextChange(e)}
  //     onKeyUp={(e) => this.handleOnKeyUp(e)}/>
  //   <span className="input-group-btn">
  //     <button className="btn btn-default" type="button" onClick={this.handleSearch.bind(this)}>Go!</button>
  //   </span>
  // </div>
  // <div id="searchResult">
  //   {this.state.searchRes.map((song) => {
  //     return(
  //       <SpotifySearchSongDisplay
  //         key={song.id}
  //         data={song}
  //         songId={song.id}
  //         groupId={this.props.groupId}
  //         handleGroupPlaylist={this.handleGroupPlaylist.bind(this)}/>
  //     )
  //   })}
  // </div>

  render() {
    let search = [];
    if (!this.state.searching) {
      search.push(
        <div ref={this.searchPanelRef}>
          <SearchPanel
            key={0}
            handleGroupPlaylist={this.handleGroupPlaylist.bind(this)}
            groupId = {this.props.groupId}/>
        </div>
      )
    }
    return (
      <div>
        <div className="col-md-12">
          <div className="container col-md-3 usersList">
            <div className="row">
              <h1>{this.state.groupInfo.groupName}</h1>
              <div>
                {this.state.groupUsers.map((user) => {
                  return(
                    <Link to={"/profile/" + user._id} key={user._id}><div id="userThumb">{user.fullName}</div></Link>
                  )
                })}
              </div>
            </div>
          </div>
          {search}
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <GroupPlaylist
                groupId = {this.props.groupId}
                onRef={ref => this.playlist = ref}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
