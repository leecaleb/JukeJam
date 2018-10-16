import React from 'react'

export default class MainFeedSongDisplay extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		var item = []
		var ytKey = 0
		if(this.props.data.kind === 'youtube#video') {
			item.push(
				<li key={ytKey++} className="list-group-item">
					{this.props.data.snippet.title.toString()} by {this.props.data.snippet.channelTitle.toString()}</li>
			)
		} else {
			item.push(
				<li key={ytKey++} className="list-group-item">
					{this.props.data.name.toString()} by {this.props.data.artists[0].name.toString()}</li>
			)
		}

		return(
			<div>
				{item}
			</div>
		)
	}
}
