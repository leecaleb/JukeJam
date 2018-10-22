var WebSocket = require('ws')
var wss = new WebSocket.Server({ port: 8989 })
var room = new Object()
var socketClients = {}
const broadcast = (data, ws) => {
	data.onlineUsers.forEach((user) => {
		const client = socketClients[user.userId]
		if (client !== ws && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data))
		}
	})
}

wss.on('connection', (ws) => {
	var user, roomId, onlineUsers
	ws.on('message', (message) => {
		const data = JSON.parse(message)
		switch (data.type) {
		case 'ADD_USER_SUCCESS': {
			roomId = data.groupPlaylistID	
			user = {
				userId: data.userId,
				username: data.username
			}
			socketClients[data.userId] = ws
			if (room[roomId] === undefined) {
				room[roomId] = [user]
			} else {
				room[roomId].push(user)
			}
			onlineUsers = room[roomId]
			ws.send(JSON.stringify({
				type: 'ONLINE_USER_LIST',
				onlineUsers
			}))
			broadcast({
				type: 'ONLINE_USER_LIST',
				onlineUsers
			}, ws)
			break
		}
		case 'ADD_SONG_SUCCESS': {
			broadcast({
				type: 'NEW_SONG_ADDED',
				song: data.song,
				onlineUsers
			}, ws)
			break
		}
		case 'PLAY_NEXT': {
			broadcast({
				type: 'NEXT_SONG',
				song: data.nextSong,
				onlineUsers
			}, ws)
			break
		}
		default: break
		}
	})
	ws.on('close', () => {
		var index = room[roomId].indexOf(user)
		room[roomId].splice(index, 1)
		onlineUsers = room[roomId]
		broadcast({
			type: 'ONLINE_USER_LIST',
			roomId: roomId,
			onlineUsers
		}, ws)
	})
})

module.exports.socket = wss