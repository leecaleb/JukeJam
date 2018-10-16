import React from 'react'
import ErrorBanner from '../../components/errorbanner'

export default class PublicHomePage extends React.Component {

	// <a href="https://whispering-chamber-83498.herokuapp.com/auth/spotify">Spotify Login</a>
	// <a href="http://localhost:5000/auth/spotify">Spotify Login</a>

	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<ErrorBanner />
						</div>
					</div>
					<div className="col-md-12" id="main">
						<a href="http://localhost:5000/auth/spotify">Spotify Login</a>
					</div>
				</div>
			</div>
		)
	}
}
