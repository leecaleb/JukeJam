import React from 'react';
import {Link} from 'react-router'

export default class LikedItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.data;
  }

  // componentWillMount() {
  //   var authorized = false;
  //   for(var i = 0; i < this.state.groupUsers.length; i++){
  //     console.log(this.state.groupUsers[i]);
  //   }
  // }

  auth() {
    var authorized = false;
    for(var i = 0; i < this.state.groupUsers.length; i++){
      if(this.state.groupUsers[i]._id === this.props.user){
        authorized = true;
        break;
      }
    }
    return authorized;
  }

  render() {
    var authorized = [];
    if(this.auth()) {
      authorized.push(
        <div className="media" key={1}>
          <div className="media-left">
            <Link to={"/group/" + this.state._id}>
              <img className="media-object" src="../img/group1.jpg" alt="..." />
            </Link>
          </div>
          <div className="media-body">
            <h5 className="media-heading"><Link to={"/group/" + this.state._id}>{this.state.groupName}</Link></h5>
            <p>by <Link to={"/profile/" + this.state.author._id}>{this.state.author.fullName}</Link><br />
              6 days ago<br/>
              126,403 views
            </p>
          </div>
        </div>
      );
    }
    else {
      authorized.push(
        <div className="media" key={2}>
          <div className="media-left">
            <Link to={"/group/" + this.state._id + "/" + this.state.groupName}>
              <img className="media-object" src="../img/group1.jpg" alt="..." />
            </Link>
          </div>
          <div className="media-body">
            <h5 className="media-heading">
              <Link to={"/group/" + this.state._id + "/" + this.state.groupName}>{this.state.groupName}</Link>
            </h5>
            <p>by <Link to={"/profile/" + this.state.author._id}>{this.state.author.fullName}</Link><br />
              6 days ago<br/>
              126,403 views
            </p>
          </div>
        </div>
      );
    }
    return(
    <div>
      {authorized}
    </div>
    )
  }
}
