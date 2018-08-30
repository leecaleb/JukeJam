import React from 'react'
import SongDisplay from './songdisplay'
import PlayingSongDisplay from './playingsongdisplay'
import {getGroupData, getPlaylist, getYoutubePlaylist} from '../server'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadPlaylist, playNext } from '../actions/index'

class GroupPlaylist extends React.Component {
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
      selected_id: 0
    };
  }

  componentWillMount() {
    console.log(this.props.group)
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
    var newArr = this.state.next_song
    if(action) {
      newArr.push(song.tracks[0]);
    } else {
      var index = newArr.map((song) => song.id).indexOf(song.tracks[0].id)
      if(index > -1) {
        newArr.splice(index, 1)
      }
    }
    this.setState({
      next_song: newArr
    });
  }

  refreshForYoutube(song, action) {
    var newArr = this.state.next_song
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
      next_song: newArr
    });
  }

  updatePlaylist() {
    console.log('updatePlaylist')
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
      var selected_id = this.props.group.selected_id
      this.props.loadPlaylist([playlistArr[selected_id]], playlistArr.slice(selected_id+1, playlistArr.length))

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

  playNextSong () {
    this.props.playNext([this.props.group.playlist[0]])
    this.handlePlay()
  }

  buildChildren (song) {
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
  }

  render() {
    console.log(this.props.group)

    let cur_song = []
    if (this.props.group.currentSong) {
      cur_song = this.props.group.currentSong
    }
    return (
      <div>
        <div className="col-md-12 group_playlist">
          <div className="row player">
          {cur_song.map((song) => {
            return (
                <PlayingSongDisplay
                  key={0}
                  data={song}
                  songId={song.id}
                  groupId={this.props.groupId}
                  playNextSong={this.playNextSong.bind(this)}
                  startPlay={this.state.startPlay}
                  onRef={ref => this.playsong = ref} />
            )
          })}
          </div>
          <div className="row">
            {this.props.group.playlist.map(this.buildChildren.bind(this))}
          </div>
        </div>
      </div>

    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators({ loadPlaylist, playNext }, dispatch)
  }
}

const GroupPlaylistContainer = connect((store) => ({
  group: store.group
}), mapDispatchToProps) (GroupPlaylist)

export default GroupPlaylistContainer
