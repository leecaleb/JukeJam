import React from 'react'
import ReactDOM from 'react-dom'
import MainFeed from './components/mainfeed'
import NavBar from './components/navbar'
import Profile from './components/profile'
import GroupInfo from './components/groupinfo'
import GroupPage from './components/grouppage'
import PublicHomePage from './components/publichomepage'
import { getUserData } from './server'
// import registerServiceWorker from './registerServiceWorker';
import { IndexRoute, Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import { loadUserData } from './actions/index'
import { setupSocket } from './sockets/index'
import { loadState, saveState } from './localStorage'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/index'

localStorage.clear()

const persistedState = loadState()
const sagaMiddleware = createSagaMiddleware()

const store = createStore(
	reducer,
	persistedState,
	applyMiddleware(sagaMiddleware)
)

store.subscribe(() => {
	saveState(store.getState())
})

class HomePage extends React.Component {
	render() {
    	return <PublicHomePage />
	}
}

class ProfilePage extends React.Component {
	render() {
		return <Profile user={this.props.params.id} />
	}
}

var sock

class GroupAuthed extends React.Component {

	componentDidMount() {
		var loc = window.location
		var new_url = ''
		if (loc.protoccol === 'https:') {
			new_url = 'wss:'
		} else {
			new_url = 'ws:'
		}
		new_url += '//' + loc.host + loc.pathname
		const socket = setupSocket(store.dispatch, new_url, store.getState().user)
		sagaMiddleware.run(rootSaga, { socket })
		sock = socket
	}

	render() {
		return <GroupInfo groupId={this.props.params.id} />
	}
}

class GroupProfile extends React.Component {
	render() {
		return <GroupPage groupId={this.props.params.id} />
	}
}

class MainPage extends React.Component {
	componentWillMount() {
		getUserData(this.props.params.id, (userData) => {
			store.dispatch(loadUserData(userData))
		})
	}

	render() {
		return <MainFeed user={this.props.params.id} />
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<NavBar />
				{this.props.children}
			</div>
		)
	}
}


ReactDOM.render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={HomePage} />
				<Route path="user/:id" component={MainPage} />
				<Route path="profile/:id" component={ProfilePage} />
				<Route path="group/:id" onLeave={() => sock.close()} component={GroupAuthed} />
				<Route path="group/:id/:grouptitle" component={GroupProfile} />
			</Route>
		</Router>
	</Provider>
), document.getElementById('main-container'))

// registerServiceWorker();
