import * as types from '../constants/ActionTypes'

export default function group(state={
  userList: [],
  playlist: [],
  currentSong: [],
  selected_id: 0,
  votes: 0
}, action) {
  switch (action.type) {
    // case 'ADD_USER_SUCCESS': {
    //   console.log('ADD_USER_SUCCESS')
    //   return {
    //     userList: action.userList
    //   }
    // }
    case 'ONLINE_USER_LIST': {
      return {
        ...state,
        userList: action.userList
      }
    }
    case 'LOAD_PLAYLIST_SUCCESS': {
      return {
        ...state,
        currentSong: action.currentSong,
        playlist: action.playlist
      }
    }
    case 'ADD_SONG_SUCCESS': {
      return {
        ...state,
        playlist: state.playlist.concat([action.song])
      }
    }
    case 'NEW_SONG_ADDED': {
      return {
        ...state,
        playlist: state.playlist.concat([action.song])
      }
    }
    case 'PLAY_NEXT': {
      console.log('group: playing next')
      return {
        ...state,
        selected_id: state.selected_id+1,
        currentSong: action.nextSong,
        playlist: state.playlist.slice(1,state.playlist.length)
      }
    }
    case 'NEXT_SONG': {
      console.log('group: next song')
      return {
        ...state,
        selected_id: state.selected_id+1,
        currentSong: action.nextSong,
        playlist: state.playlist.slice(1,state.playlist.length)
      }
    }
    case 'UPVOTE': {

    }
    case 'DOWNVOTE': {

    }
    // case 'REMOVE_SONG': { // only removable when song is downvoted
    //   return {
    //     ...state,
    //     // playlist:
    //   }
    // }
    default: return state

  }
}
