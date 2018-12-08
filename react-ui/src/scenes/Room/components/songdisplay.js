import React from 'react'

export default class SongDisplay extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		var display = []
		if (this.props.data.type == null) {
			display = (
				<div key={this.props.data.id} className="songdisplay"
					style={{
						backgroundImage: 'url(' + this.props.data.snippet.thumbnails.high.url + ')'
					}}>
				</div>
			)
		} else {
			display = (
				<div key={this.props.data.id} className="songdisplay"
					style={{
						backgroundImage: 'url(' + this.props.data.album.images[0].url + ')'
					}}>
				</div>
			)
		}

		return (
			<div>
				{display}
			</div>
		)
	}
}
