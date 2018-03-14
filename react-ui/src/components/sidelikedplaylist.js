import React from 'react';
import {getLikedPlaylist} from '../server'
import LikedItems from './likeditems'


export default class SideLikedPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likedPlaylist: []
    };
  }

  componentDidMount() {
    this.props.likeButton(this);
    getLikedPlaylist(this.props.user, (feedData) => {
      this.setState({likedPlaylist: feedData});
    });
  }

  refresh() {
    getLikedPlaylist(this.props.user, (feedData) => {
      this.setState({likedPlaylist: feedData});
    });
  }

  render() {
    return(
      <div>
        <div className="panel">
          <div className="panel-heading">
            <h2 className="panel-title">Liked Playlist</h2>
          </div>
            {this.state.likedPlaylist.map((likedItem) =>{
              return (
                <LikedItems key={likedItem._id} data={likedItem} user={this.props.user}/>
              )
            })}
        </div>
      </div>
    )
  }
}
