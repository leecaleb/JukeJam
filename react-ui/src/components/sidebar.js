import React from 'react';
import {ResetDatabase} from '../database';
import SideLikedPlaylist from './sidelikedplaylist'
import SideGroupHistory from './sidegrouphistory'

export default class SideBar extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    this.props.onRef(this)
  }

  likeButton() {
    this.likedplaylist.refresh();
  }

  render() {
    return (
      <div>
        <SideLikedPlaylist user={this.props.user} likeButton={ref => this.likedplaylist = ref}/>

        <SideGroupHistory user={this.props.user} />
        <div>
          <ResetDatabase />
        </div>
      </div>
    )
  }
}
