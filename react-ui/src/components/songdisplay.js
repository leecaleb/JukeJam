import React from 'react'
import ReactAudioPlayer from 'react-audio-player'
import Youtube from 'react-youtube'
import {addSong, removeSong, getGroupData, getPlaylist} from '../server'

export default class SongDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      songList: [],
      songIdList: [],
      selectedSong: [],
      songId: []
    };
  }

  componentDidMount() {
    getPlaylist(this.props.groupId, (playlist) => {
      this.setState({songList: playlist}, () => {
        this.setState({
          songIdList: this.state.songList.map((obj) => {
            return(obj.id);
          }),
          selectedSong: this.props.selectedSong,
          songId: this.props.songId
        });
      });
    });
    // for(var i = 0; i < this.props.playlistLength; ++i) {
    //   var newArr = this.state.songIdList.slice();
    //   getSong(this.props.groupId, i, (song) => {
    //     newArr.push(song.id);
    //     this.setState({
    //       songIdList: newArr
    //     })
    //   });
    // }
  }

  // handlePlay() {
  //   this.setState({playing: true});
  //   this.song.audioEl.play();
  // }
  //
  // handlePause() {
  //   this.setState({playing: false});
  //   this.song.audioEl.pause();
  // }

  handleAdd() {
    addSong(this.props.groupId, this.props.songId, (updatedSongList) => {
      this.setState({songList: updatedSongList});
    });
    this.props.handleGroupPlaylist();
  }

  handleRemove() {
    removeSong(this.props.groupId, this.props.songId, (updatedSongList) => {
      this.setState({songList: updatedSongList});
    });
    this.props.handleGroupPlaylist();
  }

  added() {
    var found = false;
    for(var i = 0; i < this.state.songIdList.length; i++) {
      if(this.state.songIdList[i] === this.props.data.id) {
        found = true;
        break;
      }
    }
    return found;
  }

  playNext() {
    console.log("finished");
    this.props.playNext();
  }

  render() {
    var playButton = [];
    var addButton = [];
    // if(this.state.playing){
    //   playButton.push(
    //     <button className="btn btn-default" type="button" key={0} id="playButton" onClick={this.handlePause.bind(this)}>
    //       <img src="../img/Spotify_Icon_CMYK_Green.png"></img>
    //     </button>
    //   );
    // } else {
    //   playButton.push(
    //     <button className="btn btn-default" type="button" key={1} id="playButton" onClick={this.handlePlay.bind(this)}>
    //       <img src="../img/Spotify_Icon_CMYK_Black.png"></img>
    //     </button>
    //   );
    // }

    if(this.added()) {
      addButton.push(
        <small key={1}><button className="btn btn-xs" type="button"
          id="addButton"
          onClick={this.handleRemove.bind(this)}>
          <span className="glyphicon glyphicon-ok-sign" id="added" aria-hidden="true"></span>
        </button></small>
      );
    } else {
      addButton.push(
        <small key={2}><button className="btn btn-xs" type="button"
          id="addButton"
          onClick={this.handleAdd.bind(this)}>
          <span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>
        </button></small>
      );
    }

    const opts = {
      height: '100',
      width: '100',
      playerVars: {
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        rel: 0
      }
    };

    var display = [];
    if(this.props.data.type == null) {
      display = (
        <div className="group-playlist" id="song-display">
            <Youtube
              opts={opts}
              videoId={this.props.data.id}
            />
        </div>
      )
    } else {
      display = (
        <div className="group-playlist" id="song-display">
          {playButton}
            <img src={this.props.data.album.images[0].url} alt="no album cover found :(" />
            <ReactAudioPlayer
              onEnded = {this.playNext.bind(this)}
              src = {this.props.data.preview_url}
              ref = {(e) => {this.song = e;}}
            />
        </div>
      )
    }
    // {addButton}

    return(
      <div>
        {display}
      </div>
    )
  }
}
