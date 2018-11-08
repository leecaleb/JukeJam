export default function user(state = {
	userData: [],
	loaded: false
}, action) {
	switch (action.type) {
	case 'LOAD_USER_DATA': {
		return {
			...state,
			loaded: true,
			userData: action.userData
		}
	}
	default: return state
	}
}
