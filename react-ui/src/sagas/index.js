import { takeEvery, all } from 'redux-saga/effects'

export default function* rootSaga(params) {
  yield all([
    takeEvery('ADD_SONG_SUCCESS', (action) => {
      params.socket.send(JSON.stringify(action))
    }),
    takeEvery('PLAY_NEXT', (action) => {
      params.socket.send(JSON.stringify(action))
    })
  ])
}
