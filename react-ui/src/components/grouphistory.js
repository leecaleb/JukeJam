import React from 'react';
import {Link} from 'react-router'

export default class GroupHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.data;
  }

  render() {
    return(
    <div>
      <div className="media">
        <div className="media-left">
          <Link to={"/group/" + this.state._id}>
            <img className="media-object" src="./img/group3.jpg" alt="..." />
          </Link>
        </div>
        <div className="media-body">
          <h5 className="media-heading"><Link to={"/group/" + this.state._id}>{this.state.groupName}</Link></h5>
          <p>by <Link to={"/profile/" + this.state.author._id}>{this.state.author.fullName}</Link><br/>
            3 hours ago<br/>
            135 views
          </p>
        </div>
      </div>
    </div>
    )
  }
}
