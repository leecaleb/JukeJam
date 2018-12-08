import { loadUserList, newSongAdded, nextSong, clearPlaylist } from '../actions'

export const setupSocket = (dispatch, url, groupPlaylistID, userData) => {
	// const socket = new WebSocket('ws://localhost:8989')
	const socket = new WebSocket('wss://jukejam-api.hirecaleblee.me:8989')

	socket.onopen = () => {
		socket.send(JSON.stringify({
			type: 'ADD_USER_SUCCESS',
			userId: userData._id,
			username: userData.fullName,
			groupPlaylistID: groupPlaylistID
		}))
	}

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data)
		switch (data.type) {
		case 'ONLINE_USER_LIST': {
			dispatch(loadUserList(data.onlineUsers))
			break
		}
		case 'NEW_SONG_ADDED': {
			dispatch(newSongAdded(data.song))
			break
		}
		case 'NEXT_SONG': {
			dispatch(nextSong(data.song))
			break
		}
		default: break
		}
	}

	socket.onclose = () => {
		dispatch(clearPlaylist())
	}

	return socket
}
