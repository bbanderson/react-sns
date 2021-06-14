import axios from 'axios';
import shortId from 'shortid';
import {
  all,
  delay,
  fork,
  put,
  takeLatest,
  throttle,
  call,
} from 'redux-saga/effects';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

export default function* postSaga() {
  function loadPostAPI(data) {
    return axios.get('/posts', data);
  }

  function addPostAPI(data) {
    return axios.post('/post', { content: data });
  }

  function removePostAPI(data) {
    return axios.delete('/api/post', data);
  }

  function addCommentAPI(data) {
    return axios.post(`/post/${data.postId}/comment`, data);
  }

  function likePostAPI(data) {
    return axios.patch(`/post/${data}/like`); // data를 서버에 보내는 것도 용량 차지하므로, params로 한번에 처리하자!
  }

  function unlikePostAPI(data) {
    return axios.delete(`/post/${data}/like`);
  }

  function* likePost(action) {
    try {
      const result = yield call(likePostAPI, action.data);
      yield put({ type: LIKE_POST_SUCCESS, data: result.data });
    } catch (err) {
      console.error(err);
      yield put({ type: LIKE_POST_FAILURE, error: err.response.data });
    }
  }

  function* unlikePost(action) {
    try {
      const result = yield call(unlikePostAPI, action.data);
      yield put({ type: UNLIKE_POST_SUCCESS, data: result.data });
    } catch (err) {
      console.error(err);
      yield put({ type: UNLIKE_POST_FAILURE, error: err.response.data });
    }
  }

  function* loadPost(action) {
    try {
      const result = yield call(loadPostAPI, action.data);
      yield put({
        type: LOAD_POST_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: LOAD_POST_FAILURE,
        error: err.response.data,
      });
    }
  }

  function* addPost(action) {
    try {
      const result = yield call(addPostAPI, action.data);
      const id = shortId.generate();
      yield put({
        type: ADD_POST_SUCCESS,
        data: result.data,
      });
      yield put({
        type: ADD_POST_TO_ME,
        data: result.data.id,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: ADD_POST_FAILURE,
        error: err.response.data,
      });
    }
  }

  function* removePost(action) {
    try {
      // const result = yield call(addPostAPI, action.data);
      yield delay(1000);
      const id = shortId.generate();
      yield put({
        type: REMOVE_POST_SUCCESS,
        data: action.data,
      });
      yield put({
        type: REMOVE_POST_OF_ME,
        data: action.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: REMOVE_POST_FAILURE,
        error: err.response.data,
      });
    }
  }

  function* addComment(action) {
    try {
      const result = yield call(addCommentAPI, action.data);
      yield put({
        type: ADD_COMMENT_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: ADD_COMMENT_FAILURE,
        error: err.response.data,
      });
    }
  }

  function* watchLikePost() {
    yield takeLatest(LIKE_POST_REQUEST, likePost);
  }
  function* watchUnlikePost() {
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
  }
  function* watchLoadPost() {
    yield throttle(5000, LOAD_POST_REQUEST, loadPost);
  }
  function* watchAddPost() {
    yield takeLatest(ADD_POST_REQUEST, addPost);
  }
  function* watchRemovePost() {
    yield takeLatest(REMOVE_POST_REQUEST, removePost);
  }

  function* watchAddComment() {
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
  }

  yield all([
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchLoadPost),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchAddComment),
  ]);
}
