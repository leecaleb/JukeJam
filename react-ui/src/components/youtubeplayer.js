import React from 'react'
import Youtube from 'react-youtube'
import {addYoutubeSong, removeSong, getGroupData} from '../server'

export default class YoutubePlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songidlist: [],
      songid: []
    }
  }

  componentDidMount() {
    getGroupData(this.props.groupId, (feeditem) => {
      this.setState({
        songidlist: feeditem.songs.youtube
      })
    });
  }

  handleAdd() {
    addYoutubeSong(this.props.groupId, this.props.videoId, (addedsonginfo) => {
      console.log("addedsonginfo: " + addedsonginfo);
      this.setState({
        songid: addedsonginfo
      },
      this.props.handleGroupPlaylist(addedsonginfo)
      );
    });
  }

  handleRemove() {

  }

  added() {
    var found = false;
    for(var i = 0; i < this.state.songidlist.length; ++i) {
      if(this.state.songidlist[i]._id === this.props.videoId){
        found =  true;
        break;
      }
    }
    return found;
  }

  render() {
    const opts = {
      height: '100',
      width: '100'
    };

    window.YTConfig = {
      host: 'https://www.youtube.com'
    }

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

    return(
      <div>
        <div className="media" id="song-display">
          <div className="media-left">
            <Youtube
              opts={opts}
              videoId={this.props.videoId}
            />
          </div>
          <div className="media-body">
            <h3 className="media-heading">{this.props.title + " "}</h3>{addButton}
              <p>by {this.props.channelTitle}</p>
          </div>
        </div>
      </div>
    )
  }
}
