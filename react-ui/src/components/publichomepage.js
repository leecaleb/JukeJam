import React from 'react';
import Link from 'react-router'
import ErrorBanner from './errorbanner'
import {auth} from '../server'
import GroupPlaylist from './groupplaylist'


export default class PublicHomePage extends React.Component {

  // authorize() {
  //   console.log(window.location.hostname + ":5000/auth/spotify");
  //   window.location.href = window.hostname + ":5000/auth/spotify";
  // }

// <a href="https://guarded-fortress-64455.herokuapp.com/auth/spotify">Spotify Login</a>
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
