import { all, fork } from 'redux-saga/effects';

import axios from 'axios';
import userSaga from './user';
import postSaga from './post';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  // all : 배열 내 모든 함수를 한번에 실행
  // fork나 call로 제너레이터 함수를 실행합니다.
  yield all([fork(userSaga), fork(postSaga)]);
}
