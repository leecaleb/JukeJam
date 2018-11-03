import React from 'react'
import ReactDOM from 'react-dom'
import MainFeed from './scenes/Mainfeed/mainfeed'
import NavBar from './components/navbar'
import Profile from './components/profile'
import GroupInfo from './scenes/Room/groupinfo'
import GroupPage from './components/grouppage'
import PublicHomePage from './scenes/Home/publichomepage'
import { getUserData } from './server'
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
var socket

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
		socket = setupSocket(store.dispatch, new_url, this.props.params.id, store.getState().user)
		sagaMiddleware.run(rootSaga, { socket })
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
	componentDidMount() {
		getUserData(this.props.params.id, (userData) => {
			store.dispatch(loadUserData(userData))
		})
	}

	render() {
		return <MainFeed user={this.props.params.id} />
	}
}

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			scroll_down: false,
			lastScrollPosition: window.pageYOffset
		}
		this.handleScroll = this.handleScroll.bind(this)
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll)
	}

	handleScroll() {
		var scrollTop = window.pageYOffset
		const down = scrollTop > this.state.lastScrollPosition
		this.setState({
			lastScrollPosition: scrollTop,
			scroll_down: down
		})
	}

	render() {
		var nav = this.state.scroll_down ? null : <NavBar />
		return (
			<div>
				{nav}
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
				<Route path="group/:id" onLeave={() => socket.close()} component={GroupAuthed} />
				<Route path="group/:id/:grouptitle" component={GroupProfile} />
			</Route>
		</Router>
	</Provider>
), document.getElementById('main-container'))