export default function user(state = {
	userData: [],
	loaded: false,
	loggedin: false
}, action) {
	switch (action.type) {
	case 'LOAD_USER_DATA': {
		return {
			...state,
			loaded: true,
			userData: action.userData
		}
	}
	case 'ADD_ROOM_TO_USER_GROUPS': {
		state.userData.groups.push(action.roomId)
		return {
			...state
		}
	}
	case 'LOGIN': {
		return {
			...state,
			loggedin: true
		}
	}
	case 'LOGOUT': {
		return {
			...state,
			loggedin: false
		}
	}
	default: return state
	}
}
