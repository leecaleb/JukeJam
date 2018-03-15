import React from 'react';
import Link from 'react-router'
import ErrorBanner from './errorbanner'
import {auth} from '../server'
import GroupPlaylist from './groupplaylist'


export default class PublicHomePage extends React.Component {

  // <a href="https://whispering-chamber-83498.herokuapp.com/auth/spotify">Spotify Login</a>


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
