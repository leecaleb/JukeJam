import * as types from '../constants/ActionTypes'

export default function user(state={}, action) {
  switch (action.type) {
    case 'LOAD_USER_DATA': {
      return action.userData
    }
    default: return state
  }
}
