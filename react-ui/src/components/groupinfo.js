import React from 'react';
import {Link} from 'react-router';
import {getGroupData, getSong, addSong} from '../server'
import ReactAudioPlayer from 'react-audio-player'
import SongDisplay from './songdisplay'
import GroupPlaylist from './groupplaylist'
import SpotifySearch from './spotifysearch'
import YoutubeSearch from './youtubesearch'

export default class GroupInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: [],
      groupUsers: [],
      groupPlaylist: [],
      spotify: true
    };
  }

  componentDidMount(){
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



  handleGroupPlaylist(songId) {
    this.playlist.refresh(songId);
  }

  handleGroupPlaylistYoutube(song) {
    console.log("song: " + song);
    this.playlist.refreshForYoutube(song);
  }

  switchToSpotify() {
    this.setState({spotify: true})
  }

  switchToYoutube() {
    this.setState({spotify: false})
  }

  render() {
    let search = null;
    if(this.state.spotify) {
      search = <SpotifySearch
                  groupId = {this.props.groupId}
                  handleGroupPlaylist={this.handleGroupPlaylist.bind(this)}
                  switchToSpotify={this.switchToSpotify.bind(this)}
                  switchToYoutube={this.switchToYoutube.bind(this)}/>;
    } else {
      search = <YoutubeSearch
                  groupId = {this.props.groupId}
                  handleGroupPlaylist={this.handleGroupPlaylistYoutube.bind(this)}
                  switchToSpotify={this.switchToSpotify.bind(this)}
                  switchToYoutube={this.switchToYoutube.bind(this)}/>;
    }
    // console.log("this.state.groupPlaylist: " + this.state.groupPlaylist);
    // console.log("RENDER this.state.playlistLength: " + this.state.playlistLength);

    return (
      <div>
        <div className="container usersList">
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
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <GroupPlaylist
                groupId = {this.props.groupId}
                onRef={ref => this.playlist = ref}/>
              {search}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
