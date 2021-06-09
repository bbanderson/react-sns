import { all, fork, call, take, put, delay } from 'redux-saga/effects';
import axios from 'axios';

function logInAPI(data) {
  return axios.post('/api/login', data);
}

function* logIn(action) {
  // 요청을 하고 응답을 블로킹으로 기다려야 하면 call, 논블로킹으로 패쓰하고 싶다면 fork
  // call 함수의 특징 : 호출할 함수의 이름부터 전달할 인자까지 모든 것을 인자로 각각 펼쳐서 전달한다. => 테스트하기 편함.
  // 제너레이터 안에서 내가 일시중지하기 원하는 곳마다 yield를 하고, 그때그때 next()를 하면 단위 test가 가능하다.
  /*
   * const l = login({ type: 'LOGIN_REQUEST', data: { id: '1@2.com' } });
   * l.next();
   * */
  try {
    // const result = yield call(logInAPI, action.data);
    yield delay(1000);
    yield put({
      type: 'LOG_IN_SUCCESS',
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/api/logout');
}

function* logOut() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: 'LOG_OUT_SUCCESS',
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'LOG_OUT_FAILURE',
      data: err.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/api/post', data);
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: 'ADD_POST_SUCCESS',
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: 'ADD_POST_FAILURE',
      data: err.response.data,
    });
  }
}

function* watchLogIn() {
  yield take('LOG_IN_REQUEST', logIn); // LOG_IN 액션이 실행될 때까지 기다리다가, 실행되면 logIn 호출.
}

function* watchLogOut() {
  yield take('LOG_OUT_REQUEST', logOut);
}

function* watchAddPost() {
  yield take('ADD_POST_REQUEST', addPost);
}
export default function* rootSaga() {
  // all : 배열 내 모든 함수를 한번에 실행
  // fork나 call로 제너레이터 함수를 실행합니다.
  yield all([fork(watchLogIn), fork(watchLogOut), fork(watchAddPost)]);
}
