import React from 'react'
import ErrorBanner from '../../components/errorbanner'
import server_url from '../../config'

export default class PublicHomePage extends React.Component {
	render() {
		const login_url = process.env.NODE_ENV === 'development' ?
			"http://localhost:5000/auth/spotify"
			: server_url + '/auth/spotify'
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<ErrorBanner />
						</div>
					</div>
					<div className="col-md-12" id="main">
						<a href={login_url}>Spotify Login</a>
					</div>
				</div>
			</div>
		)
	}
}
