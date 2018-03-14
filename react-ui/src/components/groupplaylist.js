import React from 'react'
import SongDisplay from './songdisplay'
import PlayingSongDisplay from './playingsongdisplay'
import {getGroupData, getPlaylist, getYoutubePlaylist} from '../server'


export default class GroupPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: [],
      youtube: [],
      spotify: [],
      songs: [],
      playing: false,
      selected: -1
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    getGroupData(this.props.groupId, (groupinfo) => {
      // console.log(groupinfo.songs);
      this.setState({
        songs: groupinfo.songs
      },
      getPlaylist(this.props.groupId, (songlist) => {
        // console.log("songlist: " + songlist);
        this.setState({
          spotify: songlist
        },
        getYoutubePlaylist(this.props.groupId, (songlist) => {
          // console.log("youtube songlist: ");
          // console.log(songlist);
          this.setState({
            youtube: songlist
          },
          this.updatePlaylist)
        }))
      }))
    });
  }

  refresh(song) {
    var newArr = this.state.playlist.reverse();
    newArr.push(song.tracks[0]);
    this.setState({
      playlist: newArr.reverse()
    });
  }

  refreshForYoutube(song) {
    var newArr = this.state.playlist.reverse();
    console.log(song[0]);
    newArr.push(song[0]);
    this.setState({
      playlist: newArr.reverse()
    });
  }

  updatePlaylist() {
      var playlistArr = [];
      var spotify = this.state.songs.spotify;
      var youtube = this.state.songs.youtube;
      var songid = 0;
      for(var i = 0; i < spotify.length; ++i) {
        for(var j = songid; j < this.state.spotify.length; ++j) {
          if(spotify[i]._id === this.state.spotify[j].id) {
            playlistArr[spotify[i].index] = this.state.spotify[j];
            songid++;
            break;
          }
        }
      }
      songid = 0;
      for(var i = 0; i < youtube.length; ++i) {
        for(var j = songid; j < this.state.youtube.length; ++j) {
          if(youtube[i]._id === this.state.youtube[j].id) {
            playlistArr[youtube[i].index] = this.state.youtube[j];
            songid++;
            break;
          }
        }
      }
      this.setState({
        playlist: playlistArr.reverse(),
        // selected: playlistArr.length-1
        selected: 4
      });
  }

  buildChildren(song) {
    if(this.state.selected !== -1 && this.state.playlist[this.state.selected].id === song.id) {

      console.log(this.state.playlist[this.state.selected]);

      return (
        <div key={song.id} className="songdisplay">
          <PlayingSongDisplay
            data={song}
            songId={song.id}
            groupId={this.props.groupId}
            handleGroupPlaylist={this.refresh.bind(this)}
            playNext={this.playNext.bind(this)}
            selectedSong={this.state.playlist[this.state.selected].id}
            onRef={ref => this.playsong = ref}/>
        </div>
      )
    } else {
      return (
        <div key={song.id} className="songdisplay">
          <SongDisplay
            data={song}
            songId={song.id}
            groupId={this.props.groupId}
            handleGroupPlaylist={this.refresh.bind(this)} />
        </div>
      )
    }
  }

  // {this.state.playlist.map((song) => {
  //   return (
  //     <div key={song.id} className="songdisplay">
  //       <SongDisplay
  //         data={song}
  //         songId={song.id}
  //         groupId={this.props.groupId}
  //         handleGroupPlaylist={this.refresh.bind(this)}/>
  //     </div>
  //   )
  // })}

  handlePlay() {
    // console.log("this.state.playing: " + this.state.playing);
    if(this.state.selected !== -1){
      this.setState({
        playing: true
      }, this.playsong.handlePlay())
    } else {
      console.log("playlist finished!!");
    }
  }

  handlePause() {
    this.setState({
      playing: false
    }, this.playsong.handlePause())
  }

  playNext() {
    this.setState({
      selected: --this.state.selected,
      playing: false
    }, this.handlePlay
    );
  }

  render() {

    var playButton = [];
    if(this.state.playing){
      playButton.push(
        <button className="btn btn-default" type="button" key={0} id="searchPlayButton" onClick={this.handlePause.bind(this)}>
          <span className="glyphicon glyphicon-pause" aria-hidden="true"></span>
        </button>
      );
    } else {
      playButton.push(
        <button className="btn btn-default" type="button" key={1} id="searchPlayButton" onClick={this.handlePlay.bind(this)}>
          <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
        </button>
      );
    }

    var playingsonginfo = [];
    if(this.state.selected !== -1) {
      if(this.state.playlist[this.state.selected].type == null) {
        playingsonginfo.push(
            <div className="media-body">
              <h3 className="media-heading">{this.state.playlist[this.state.selected].snippet.title.toString() + " "}
                </h3>
                <p>by {this.state.playlist[this.state.selected].snippet.channelTitle.toString()}</p>
            </div>
        )

      } else {
        playingsonginfo.push(
            <div className="media-body">
              <h3 className="media-heading">{this.state.playlist[this.state.selected].name.toString() + " "}
                </h3>
                <p>{this.state.playlist[this.state.selected].artists[0].name.toString()} · {this.state.playlist[this.state.selected].album.name.toString()}</p>
            </div>
        )
      }
    }

    return (
      <div>
        <div className="col-md-6">
          <h1>Your Playlist</h1>
            <div className="row">
              <div className="media-left">
                {playButton}
              </div>
              {playingsonginfo}
            </div>
          {this.state.playlist.map(this.buildChildren.bind(this))}
        </div>
      </div>

    )
  }
}
