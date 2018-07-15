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
      startPlay: false,
      playing_song: [],
      next_song: [],
      selected_id: 7
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    getGroupData(this.props.groupId, (groupinfo) => {
      this.setState({
        songs: groupinfo.songs
      },
      getPlaylist(this.props.groupId, (songlist) => {
        this.setState({
          spotify: songlist
        },
        getYoutubePlaylist(this.props.groupId, (songlist) => {

          this.setState({
            youtube: songlist
          },
          this.updatePlaylist)
        }))
      }))
    });
  }

  // action: 1 if song added and 0 if song removed
  refresh(song, action) {
    var newArr = this.state.playlist
    if(action) {
      newArr.push(song.tracks[0]);
    } else {
      var index = newArr.map((song) => song.id).indexOf(song.tracks[0].id)
      if(index > -1) {
        newArr.splice(index, 1)
      }
    }
    this.setState({
      playlist: newArr
    });
  }

  refreshForYoutube(song, action) {
    var newArr = this.state.playlist
    if (action) {
      newArr.push(song[0])
    } else {
      console.log('refreshForYoutube')
      console.log(song[0])
      var index = newArr.map((song) => song.id).indexOf(song[0].id)
      if (index > -1) {
        newArr.splice(index, 1)
      }
    }
    this.setState({
      playlist: newArr
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
      var selected_id = this.state.selected_id
      this.setState({
        playlist: playlistArr,
        playing_song: [playlistArr[selected_id]],
        next_song: [playlistArr[selected_id+1]]
      });
  }

  buildChildren(song) {
    if(this.state.selected !== -1 && this.state.playlist[this.state.selected].id === song.id) {
      return (
        <div key={song.id} className="songdisplay">
          <PlayingSongDisplay
            data={song}
            songId={song.id}
            groupId={this.props.groupId}
            handleGroupPlaylist={this.refresh.bind(this)}
            playNext={this.playNext.bind(this)}
            startPlay={this.state.startPlay}
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

  handlePlay() {
    if(!this.state.startPlay) {
      this.setState({
        startPlay:true
      })
    }

    this.setState({
      playing: true
    }, () => {
      this.playsong.handlePlay()
    })
  }

  handlePause() {
    this.setState({
      playing: false
    }, this.playsong.handlePause())
  }

  playNext() {
    if (this.state.selected_id+2 < this.state.playlist.length) {
      this.setState({
        selected_id: ++this.state.selected_id,
        playing_song: [this.state.playlist[this.state.selected_id]],
        next_song: [this.state.playlist[this.state.selected_id+1]]
      }, () => {
        this.handlePlay()
      });
    } else if (this.state.selected_id+1 < this.state.playlist.length) { //playnext and last song
      this.setState({
        selected_id: ++this.state.selected_id,
        playing_song: [this.state.playlist[this.state.selected_id]],
        next_song: [null]
      }, () => {
        this.handlePlay()
      });
    } else {
      // TODO: // check to see if there's any newly added song

    }
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

    return (
      <div>
        <div className="col-md-6">

          <div className="row">
            <div className="media-left">
              {playButton}
            </div>
            {this.state.playing_song.map((song) => {
              if(song.type == null) {
                //Youtube song info
                return (
                  <div className="media-body" key={song.id}>
                    <h3 className="media-heading">{song.snippet.title.toString() + " "}
                      </h3>
                      <p>by {song.snippet.channelTitle.toString()}</p>
                  </div>
                )

              } else {
                //Spotify song info
                return (
                  <div className="media-body" key={song.id}>
                    <h3 className="media-heading">{song.name.toString() + " "}
                      </h3>
                      <p>{song.artists[0].name.toString()} · {song.album.name.toString()}</p>
                  </div>
                )
              }
            })}
          </div>

          {this.state.playing_song.map((song) => {
            return (
              <div key={song.id} className="songdisplay">
                <PlayingSongDisplay
                  data={song}
                  songId={song.id}
                  groupId={this.props.groupId}
                  playNext={this.playNext.bind(this)}
                  startPlay={this.state.startPlay}
                  onRef={ref => this.playsong = ref} />
              </div>
            )
          })}
          {this.state.next_song.map((song) => {
            if (song != null) {
              return (
                <div key={song.id} className="songdisplay">
                  <SongDisplay
                    data={song}
                    songId={song.id}
                    groupId={this.props.groupId} />
                </div>
              )
            }
          })}


        </div>
      </div>

    )
  }
}
