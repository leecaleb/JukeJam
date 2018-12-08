import React from 'react'
import ErrorBanner from '../../components/errorbanner'
import server_url from '../../config'

export default class PublicHomePage extends React.Component {
	render() {
		const login_url = process.env.NODE_ENV === 'development' ?
			'http://localhost:5000/auth/spotify'
			// server_url + '/auth/spotify'
			: 'https://jukejam-api.hirecaleblee.me' + '/auth/spotify'
		return (
			<div>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ErrorBanner />
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="panel panel-default" id="login-panel">
								<div className="panel-body" >
									<div className="row">
										<img className="login-logo" />
									</div>
									<div style={{ textAlign: 'center', paddingTop: 30 }}>
										<a className="login-link" href={login_url}>Spotify Login</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
