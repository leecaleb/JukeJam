import * as types from '../constants/ActionTypes'
import { addUser, loadUserList, newSongAdded, nextSong } from '../actions'

export const setupSocket = (dispatch, url, userData) => {
  // const socket = new WebSocket(url + '/to/ws')
  const socket = new WebSocket('ws://localhost:8989')
  // console.log(socket)
  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: 'ADD_USER_SUCCESS',
      userId: userData._id,
      username: userData.fullName
    }))
  }

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    switch (data.type) {
      case 'ONLINE_USER_LIST': {
        dispatch(loadUserList(data.users))
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

  return socket
}
