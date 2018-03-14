import React from 'react';
import {Link} from 'react-router';
import {getGroupData, searchSong, getPlaylist} from '../server'
import ReactAudioPlayer from 'react-audio-player'
import SongDisplay from './songdisplay'

export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupInfo: [],
      groupUsers: []
    };
  }

  componentDidMount(){
    getGroupData(this.props.groupId, (group) => {
      // console.log(group.songs);
      this.setState({
        groupInfo: group,
        groupUsers: group.groupUsers
      });
    })

    // getPlaylist(this.props.groupId, (playlist) => {
    //   this.setState({
    //     groupPlaylist: playlist
    //   });
    // })
  }

  // <img key={user._id} src={user.img} />

  render() {
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
        <div className="row">
          <div className="col-md-12">
          </div>
        </div>
      </div>
    )
  }
}
