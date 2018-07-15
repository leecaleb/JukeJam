import React from 'react';
import {Link} from 'react-router';
import {getGroupData, getSong, addSong} from '../server'
import ReactAudioPlayer from 'react-audio-player'
import SongDisplay from './songdisplay'
import GroupPlaylist from './groupplaylist_new2'
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

  componentDidMount () {
    document.addEventListener('mousedown', this.handleLeavePanel)
    getGroupData(this.props.groupId, (group) => {
      this.setState({
        groupInfo: group,
        groupUsers: group.groupUsers
      });
    });
  }

  handleGroupPlaylist(songId, action, spotify_search) {
    if (spotify_search) {
      this.playlist.refresh(songId, action);
    } else {
      this.playlist.refreshForYoutube(songId, action);
    }
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

  render() {
    let search = [];
    if (!this.state.searching) {
      search.push(
        <div key={0} ref={this.searchPanelRef}>
          <SearchPanel
            handleGroupPlaylist={this.handleGroupPlaylist.bind(this)}
            groupId = {this.props.groupId}
            songs= {this.state.groupInfo.songs}/>
        </div>
      )
    }
    return (
      <div>
        <div className="col-md-12">
          {search}
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

        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <GroupPlaylist
                groupId = {this.props.groupId}
                onRef={ref => this.playlist = ref} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
