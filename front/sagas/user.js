import { all, delay, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
} from '../reducers/user';

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function signUpAPI(data) {
  return axios.post('/user', data);
}

function followAPI() {
  return axios.post('/api/follow');
}

function unfollowAPI() {
  return axios.post('/api/unfollow');
}

function* follow(action) {
  try {
    // const result = yield call(followAPI)
    yield delay(1000);
    yield put({ type: FOLLOW_SUCCESS, data: action.data });
  } catch (err) {
    yield put({ type: FOLLOW_FAILURE, error: err.response.data });
  }
}

function* unfollow(action) {
  try {
    // const result = yield call(unfollowAPI)
    yield delay(1000);
    yield put({ type: UNFOLLOW_SUCCESS, data: action.data });
  } catch (err) {
    yield put({ type: UNFOLLOW_FAILURE, error: err.response.data });
  }
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
    // console.log('SAGA Login 💖');
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
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
      type: LOG_OUT_SUCCESS,
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      data: err.response.data,
    });
  }
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({ type: SIGN_UP_SUCCESS });
  } catch (err) {
    yield put({ type: SIGN_UP_FAILURE, error: err.response.data });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow); // LOG_IN 액션이 실행될 때까지 기다리다가, 실행되면 logIn 호출.
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow); // LOG_IN 액션이 실행될 때까지 기다리다가, 실행되면 logIn 호출.
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn); // LOG_IN 액션이 실행될 때까지 기다리다가, 실행되면 logIn 호출.
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
  ]);
}
