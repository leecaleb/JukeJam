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
      height: '300',
      width: '300',
      playerVars: {
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        rel: 0,
        autoplay: 1
      }
    };

    var album_cover = [];
    var display = []

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

    if(this.props.data.type == null) { //youtube
      album_cover = (
        <div className="group-playlist media-left playingsongdisplay" key={this.props.songId}>
            <Youtube
              id={'youtube-player-'+ this.props.data.id}
              opts={opts}
              videoId={this.props.data.id}
              onEnd={this.playNext.bind(this)}
              onReady={this.onReady.bind(this)}
            />
        </div>
      )
      display = (
        <div className="media-body" key={this.props.songId + '0'}>
          {playButton}
          <h3 className="media-heading">{this.props.data.snippet.title.toString() + " "}
            </h3>
            <p>by {this.props.data.snippet.channelTitle.toString()}</p>
            <button className="btn btn-default" type="button" id="upvote" key={0}>
              <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
            </button>
            <button className="btn btn-default" type="button" id="downvote" key={1}>
              <span className="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
            </button>
        </div>
      )
    } else { //spotify
      album_cover = (
        <div className="group-playlist media-left playingsongdisplay" key={this.props.songId}>
            <img src={this.props.data.album.images[0].url} alt="no album cover found :(" />
            <ReactAudioPlayer
              onEnded = {this.playNext.bind(this)}
              src = {this.props.data.preview_url}
              ref = {(e) => {this.song = e;}}
            />
        </div>
      )
      display = (
        <div className="media-body" key={this.props.songId + '1'}>
          {playButton}
          <h3 className="media-heading">{this.props.data.name.toString() + " "}
            </h3>
            <p>{this.props.data.artists[0].name.toString()} · {this.props.data.album.name.toString()}</p>
            <button className="btn btn-default" type="button" id="upvote" key={0}>
              <span className="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>
            </button>
            <button className="btn btn-default" type="button" id="downvote" key={1}>
              <span className="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>
            </button>
        </div>
      )
    }

    return(
      <div>
        {album_cover}
        {display}
      </div>
    )
  }
}
