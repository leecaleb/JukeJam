import React from 'react'

export default class PlayingSong extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    this.setState({

    })
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
        //Youtube song info
        playingsonginfo.push(
            <div className="group-playlist" id="youtube-song-display">
                <Youtube
                  id={'youtube-player-'+ this.props.data.id}
                  opts={opts}
                  videoId={this.props.data.id}
                  onEnd={this.playNext.bind(this)}
                  onReady={this.onReady.bind(this)}
                />
            </div>
            <div className="media-body">
              <h3 className="media-heading">{this.state.playlist[this.state.selected].snippet.title.toString() + " "}
                </h3>
                <p>by {this.state.playlist[this.state.selected].snippet.channelTitle.toString()}</p>
            </div>
        )

      } else {
        //Spotify song info
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
        <div className="row">
          <div className="media-left">
            {playButton}
          </div>
          {playingsonginfo}
        </div>
      </div>
    )
  }
}
