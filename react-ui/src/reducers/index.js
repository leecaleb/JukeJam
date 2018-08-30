import { combineReducers } from 'redux'

import feedData from './feedReducer'
import user from './user'
import group from './group'

export default combineReducers({
  user,
  group
})
