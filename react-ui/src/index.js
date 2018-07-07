import React from 'react';
import ReactDOM from 'react-dom';
import MainFeed from './components/mainfeed'
import NavBar from './components/navbar'
import Profile from './components/profile'
import GroupInfo from './components/groupinfo_new'
import GroupPage from './components/grouppage'
import PublicHomePage from './components/publichomepage'
// import registerServiceWorker from './registerServiceWorker';
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

class HomePage extends React.Component {
  render() {
    return <PublicHomePage groupId={1}/>;
  }
}

class ProfilePage extends React.Component {
  render() {
    return <Profile user={this.props.params.id} />;
  }
}

class GroupAuthed extends React.Component {
  render() {
    return <GroupInfo groupId={this.props.params.id} />;
  }
}

class GroupProfile extends React.Component {
  render() {
    return <GroupPage groupId={this.props.params.id} />;
  }
}

class MainPage extends React.Component {
  render() {
    return <MainFeed user={this.props.params.id}/>
  }
}

class App extends React.Component {

  render() {
    return (
      <div>
        <NavBar />
        {this.props.children}
      </div>
    );
  }
}


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="user/:id" component={MainPage} />
      <Route path="profile/:id" component={ProfilePage}/>
      <Route path="group/:id" component={GroupAuthed} />
      <Route path="group/:id/:grouptitle" component={GroupProfile} />
    </Route>
  </Router>
),document.getElementById('main-container'));

// registerServiceWorker();
