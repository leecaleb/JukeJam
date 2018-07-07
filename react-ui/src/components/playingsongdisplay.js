import React from 'react'
import ReactAudioPlayer from 'react-audio-player'
import Youtube from 'react-youtube'
import {addSong, removeSong, getGroupData, getPlaylist} from '../server'

export default class PlayingSongDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      songList: [],
      songIdList: [],
      songId: [],
      player_ready: false
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    getPlaylist(this.props.groupId, (playlist) => {
      this.setState({songList: playlist}, () => {
        this.setState({
          songIdList: this.state.songList.map((obj) => {
            return(obj.id);
          })
        });
      });
    });
  }

  handlePlay() {
    // console.log("playingsongdisplay: " + this.props.selectedSong);
    // console.log("playingsongdisplay: " + this.props.songId);
    // document.body.style.background-image = url(this.props.data.snippet.thumbnails.maxres.url);

    if(this.props.data.type == null){
      this.setState({
        playing: true
      }, () => {
        if (this.state.player_ready) {
          document.getElementById('youtube-player-' + this.props.data.id).contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
        }
      });
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
        }, document.getElementById('youtube-player-' + this.props.data.id).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'));
        // this.song.target.pauseVideo();
    } else {
        this.setState({playing: false});
        this.song.audioEl.pause();
    }
  }

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
    this.setState({
      playing: false
    }, this.props.playNext())
  }

  onReady(e) {
    console.log('onReady!!!')
    this.setState({
      playing: true,
      player_ready: true
    }, () => {
      // e.target.playVideo()
      if(!this.props.startPlay) {
        e.target.pauseVideo()
      }
    })
  }

  render() {
    var playButton = [];
    var addButton = [];

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
        rel: 0,
        autoplay: 1
      }
    };

    var display = [];

    if(this.props.data.type == null) { //youtube
      display = (
        <div className="group-playlist" id="song-display">
            <Youtube
              id={'youtube-player-'+ this.props.data.id}
              opts={opts}
              videoId={this.props.data.id}
              onEnd={this.playNext.bind(this)}
              onReady={this.onReady.bind(this)}
            />
        </div>
      )
    } else { //spotify
      if(this.state.playing){
        playButton.push(
          <button className="btn btn-default" type="button" key={0} id="playButton" onClick={this.handlePause.bind(this)}>
            <img src="../img/Spotify_Icon_CMYK_Green.png"></img>
          </button>
        );
      } else {
        playButton.push(
          <button className="btn btn-default" type="button" key={1} id="playButton" onClick={this.handlePlay.bind(this)}>
            <img src="../img/Spotify_Icon_CMYK_Black.png"></img>
          </button>
        );
      }
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
