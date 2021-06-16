import { all, delay, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import {
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
} from '../reducers/user';

function loadMyInfoAPI() {
  // 내 정보
  return axios.get('/user');
}

function loadUserAPI(data) {
  // 남 정보
  return axios.get(`/user/${data}`);
}

function logInAPI(data) {
  return axios.post('/user/login', data);
}

function signUpAPI(data) {
  return axios.post('/user', data);
}

function changeNicknameAPI(data) {
  return axios.patch('/user/nickname', { nickname: data });
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function loadFollowersAPI(data) {
  return axios.get('/user/followers', data);
}

function loadFollowingsAPI(data) {
  return axios.get('/user/followings', data);
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({ type: LOAD_MY_INFO_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_MY_INFO_FAILURE, error: err.response.data });
  }
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({ type: LOAD_USER_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_USER_FAILURE, error: err.response.data });
  }
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({ type: FOLLOW_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: FOLLOW_FAILURE, error: err.response.data });
  }
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({ type: UNFOLLOW_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: UNFOLLOW_FAILURE, error: err.response.data });
  }
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data);
    yield put({ type: LOAD_FOLLOWERS_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_FOLLOWERS_FAILURE, error: err.response.data });
  }
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data);
    yield put({ type: LOAD_FOLLOWINGS_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_FOLLOWINGS_FAILURE, error: err.response.data });
  }
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({ type: REMOVE_FOLLOWER_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: REMOVE_FOLLOWER_FAILURE, error: err.response.data });
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
    console.error(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/user/logout');
}

function* logOut() {
  try {
    const result = yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({ type: SIGN_UP_SUCCESS });
  } catch (err) {
    console.error(err);
    yield put({ type: SIGN_UP_FAILURE, error: err.response.data });
  }
}

function* changeNickname(action) {
  const result = yield call(changeNicknameAPI, action.data);
  try {
    yield put({ type: CHANGE_NICKNAME_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: CHANGE_NICKNAME_FAILURE, error: err.response.data });
  }
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}
function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
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

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadMyInfo),
    fork(watchLoadUser),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchChangeNickname),
  ]);
}
