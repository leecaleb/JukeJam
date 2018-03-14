import React from 'react'

export default class MainFeedSongDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  // render() {
  //   return(
  //     <div></div>
  //   );
  // }

  render() {
    var item = [];
    // console.log("mainfeedsongdisplay: ");
    // console.log("this.props.data: " + this.props.data);
    // console.log("this.props.data.name: " + this.props.data.name);
    var ytKey = 0;
    if(this.props.data.kind === "youtube#video") {
      // console.log("null");
      item.push(
        <li key={ytKey++} className="list-group-item">
          {this.props.data.snippet.title.toString()} by {this.props.data.snippet.channelTitle.toString()}</li>
      );
    } else {
      item.push(
        <li key={ytKey++} className="list-group-item">
          {this.props.data.name.toString()} by {this.props.data.artists[0].name.toString()}</li>
      );
    }

    return(
      <div>
        {item}
      </div>
    )
  }
}
