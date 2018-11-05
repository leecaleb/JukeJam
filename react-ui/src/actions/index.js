export const loadFeed = (feedData) => ({
	type: 'LOAD_FEED_SUCCESS',
	feedData
})

export const loadUserData = (userData) => ({
	type: 'LOAD_USER_DATA',
	userData
})

export const addUser = (userId) => ({
	type: 'ADD_USER_SUCCESS',
	userId
})

export const loadUserList = (userList) => ({
	type: 'ONLINE_USER_LIST',
	userList
})

export const loadPlaylist = (currentSong, playlist) => ({
	type: 'LOAD_PLAYLIST_SUCCESS',
	currentSong,
	playlist
})

export const addNewSong = (song) => ({
	type: 'ADD_SONG_SUCCESS',
	song
})

export const newSongAdded = (song) => ({
	type: 'NEW_SONG_ADDED',
	song
})

export const playNext = (nextSong) => ({
	type: 'PLAY_NEXT',
	nextSong
})

export const nextSong = (nextSong) => ({
	type: 'NEXT_SONG',
	nextSong
})

export const addMarkToRedux = (userData) => ({
	type: 'LOAD_USER_DATA',
	userData
})

export const upvote = () => ({
	type: 'UPVOTE'
})

export const downvote = () => ({
	type: 'DOWNVOTE'
})

// export const load
