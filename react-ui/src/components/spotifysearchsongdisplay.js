import React from 'react'
import ReactAudioPlayer from 'react-audio-player'
import Youtube from 'react-youtube'
import {addSong, removeSong, getGroupData, getPlaylist} from '../server'

export default class SpotifySearchSongDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      songList: [],
      songIdList: []
    };
  }

  componentDidMount() {
    getPlaylist(this.props.groupId, (playlist) => {
      this.setState({songList: playlist}, () => {
        this.setState({
          songIdList: this.state.songList.map((obj) => {
            return(obj.id);
          })
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

  handlePlay() {
    this.setState({playing: true});
    this.song.audioEl.play();
  }

  handlePause() {
    this.setState({playing: false});
    this.song.audioEl.pause();
  }

  handleAdd() {
    // console.log("this.state.songList: " + this.state.songList)
    // console.log("this.props.songId: " + this.props.songId);
    addSong(this.props.groupId, this.props.songId, (updatedSongList) => {
      this.setState(
        {songList: updatedSongList},
        this.props.handleGroupPlaylist(updatedSongList)
      );
    });
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

  render() {
    var playButton = [];
    var addButton = [];
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
        modestbranding: 1
      }
    };

    var display = [];
    // this.props.data.kind
    if(this.props.data.type == null) {
      // console.log("NULL");
      // console.log(this.props.data);
      display = (
        <div className="media">
          <div className="media-left">
            <Youtube
              opts={opts}
              videoId={this.props.data.id}
            />
          </div>
        </div>
      )

    } else {
      display = (<div className="media">
        <div className="media-left">
          {playButton}
        </div>
        <div className="media-body">
          <ReactAudioPlayer
            src = {this.props.data.preview_url}
            ref = {(e) => {this.song = e;}}
          />
        <h3 className="media-heading">{this.props.data.name.toString() + " "}
            {addButton}
          </h3>
          <p>{this.props.data.artists[0].name.toString()} · {this.props.data.album.name.toString()}</p>
        </div>
      </div>)

    }

    return(
      <div>
        {display}
      </div>
    )
  }
}
