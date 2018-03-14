import React from 'react';
import NavBar from './navbar';
import ErrorBanner from './errorbanner';
// import {login} from '../server'

export default class Profile extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  // handleLogin() {
  //   login(() => {
  //     console.log("logging in...")
  //   })
  // }
  //
  // <div className="col-md-12 login-button">
  //   <button type="button" className="btn spotify-login-button" onClick={this.handleLogin.bind(this)}/>
  // </div>

  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <ErrorBanner />
            </div>
          </div>
          <div className="col-md-12 profile">
            <h1>Profile of user with id: {this.props.user}</h1>
          </div>

        </div>
      </div>
    )
  }
}
