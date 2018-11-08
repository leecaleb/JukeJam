export default function feedReducer(state={
	feedData: [],
	loading: false,
	loaded: false,
	error: null
}, action) {
	switch (action.type) {
	case 'LOAD_FEED': {
		return {...state, loading: true}
	}
	case 'LOAD_FEED_REJECTED': {
		return {...state, loading: false, error: action.payload}
	}
	case 'LOAD_FEED_SUCCESS': {
		return {
			...state,
			loading: false,
			loaded: true,
			feedData: action.feedData.contents
		}
	}
	default: return state
	}

}
