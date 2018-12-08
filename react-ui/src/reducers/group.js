
export default function group(state={
	userList: [],
	playlist: [],
	currentSong: [],
	selected_id: 0,
	votes: 0
}, action) {
	switch (action.type) {
	case 'ONLINE_USER_LIST': {
		return {
			...state,
			userList: action.userList
		}
	}
	case 'LOAD_PLAYLIST_SUCCESS': {
		return {
			...state,
			currentSong: action.currentSong.length ? action.currentSong : [],
			playlist: action.playlist
		}
	}
	case 'ADD_SONG_SUCCESS': {
		if (state.currentSong.length) {
			return {
				...state,
				playlist: state.playlist.concat([action.song])
			}
		} else {
			return {
				...state,
				currentSong: [action.song]
			}
		}
	}
	case 'NEW_SONG_ADDED': {
		return {
			...state,
			playlist: state.playlist.concat([action.song])
		}
	}
	case 'PLAY_NEXT': {
		return {
			...state,
			selected_id: state.selected_id+1,
			currentSong: action.nextSong,
			playlist: state.playlist.slice(1,state.playlist.length)
		}
	}
	case 'NEXT_SONG': {
		return {
			...state,
			selected_id: state.selected_id+1,
			currentSong: action.nextSong,
			playlist: state.playlist.slice(1,state.playlist.length)
		}
	}
	case 'CLEAR_PLAYLIST': {
		return {
			userList: [],
			playlist: [],
			currentSong: [],
			selected_id: 0,
			votes: 0
		}
	}
	case 'UPVOTE': {
		return {
			// TODO
		}
	}
	case 'DOWNVOTE': {
		return {
			// TODO
		}
	}
	case 'REMOVE_SONG': { // only removable when song is downvoted
		return {
			// TODO
		}
	}
	default: return state
	}
}
