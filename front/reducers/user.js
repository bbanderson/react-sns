import produce from 'immer';

export const initialState = {
  loadMyInfoLoading: false, // 내 로그인 정보 가져오기 시도 중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadUserLoading: false, // 남의 정보 가져오기 시도 중
  loadUserDone: false,
  loadUserError: null,
  followLoading: false, // 팔로우 시도 중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도 중
  unfollowDone: false,
  unfollowError: null,
  isLoggingIn: false, // 로그인 시도 중
  isLoggedIn: false,
  logInError: null,
  isLoggingOut: false, // 로그아웃 시도 중
  isLoggedOut: false,
  logOutError: null,
  isSigningUp: false, // 회원가입 시도 중
  isSignedUp: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  loadFollowersLoading: false, // 팔로워 로드 시도중
  loadFollowersDone: false,
  loadFollowersError: null,
  loadFollowingsLoading: false, // 팔로잉 로드 시도중
  loadFollowingsDone: false,
  loadFollowingsError: null,
  removeFollowerLoading: false, // 팔로워 차단 시도중
  removeFollowerDone: false,
  removeFollowerError: null,
  me: null,
  userInfo: null,
  signUpData: {},
  logInData: {},
};

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const RESET_LOG_IN_ERROR = 'RESET_LOG_IN_ERROR';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

/* redux-thunk code
export const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState(); // combineReducers에 정의된 initialState가 로드됨.
    dispatch(loginRequestAction());
    axios
      .post('/api/login')
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => dispatch(loginFailureAction(err)));
  };
};
*/
const dummyUser = (data) => ({
  ...data,
  id: 1,
  nickname: 'bban',
  Posts: [{ id: 1 }], // 추후 Sequelize로 데이터를 합칠 것은 대문자로 입력.
  Followings: [],
  Followers: [],
});
export const loginRequestAction = (data) => ({
  type: 'LOG_IN_REQUEST',
  data,
});

export const resetLogInError = () => ({
  type: 'RESET_LOG_IN_ERROR',
});
export const loginSuccessAction = (data) => ({
  type: 'LOG_IN_SUCCESS',
  data,
});
export const loginFailureAction = (data) => ({
  type: 'LOG_IN_FAILURE',
  data,
});

export const logoutRequestAction = () => ({
  type: 'LOG_OUT_REQUEST',
});
export const logoutSuccessAction = () => ({
  type: 'LOG_OUT_SUCCESS',
});
export const logoutFailureAction = () => ({
  type: 'LOG_OUT_FAILURE',
});

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST:
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoDone = false;
        draft.loadMyInfoError = null;
        break;
      case LOAD_MY_INFO_SUCCESS:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoDone = true;
        draft.me = action.data;
        break;
      case LOAD_MY_INFO_FAILURE:
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
        break;
      case LOAD_USER_REQUEST:
        draft.loadUserLoading = true;
        draft.loadUserDone = false;
        draft.loadUserError = null;
        break;
      case LOAD_USER_SUCCESS:
        draft.loadUserLoading = false;
        draft.loadUserDone = true;
        draft.userInfo = action.data;
        break;
      case LOAD_USER_FAILURE:
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
        break;
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.me.Followings.push({ id: action.data.UserId });
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        draft.me.Followings = draft.me.Followings.filter(
          (v) => v.id !== action.data.UserId
        );
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      case LOG_IN_REQUEST:
        console.log('REDUCER Login 💖');
        draft.isLoggingIn = true;
        draft.isLoggedIn = false;
        draft.logInError = null;
        break;
      case LOG_IN_SUCCESS:
        draft.isLoggingIn = false;
        draft.isLoggedIn = true;
        draft.me = action.data;
        break;
      case LOG_IN_FAILURE:
        draft.isLoggingIn = false;
        draft.logInError = action.error;
        break;
      case RESET_LOG_IN_ERROR:
        draft.logInError = null;
        break;
      case LOG_OUT_REQUEST:
        draft.isLoggingOut = true;
        draft.isLoggedOut = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.isLoggingOut = false;
        draft.isLoggedOut = true;
        draft.me = null;
        break;
      case LOG_OUT_FAILURE:
        draft.isLoggingOut = false;
        draft.logOutError = action.error;
        break;
      case SIGN_UP_REQUEST:
        draft.isSigningUp = true;
        draft.isSignedUp = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.isSigningUp = false;
        draft.isSignedUp = true;
        break;
      case SIGN_UP_FAILURE:
        draft.isSigningUp = false;
        draft.signUpError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.me.nickname = action.data.nickname;
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case LOAD_FOLLOWERS_REQUEST:
        draft.loadFollowersLoading = true;
        draft.loadFollowersDone = false;
        draft.loadFollowersError = null;
        break;
      case LOAD_FOLLOWERS_SUCCESS:
        draft.loadFollowersLoading = false;
        draft.me.Followers = action.data;
        draft.loadFollowersDone = true;
        break;
      case LOAD_FOLLOWERS_FAILURE:
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = action.error;
        break;
      case LOAD_FOLLOWINGS_REQUEST:
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsDone = false;
        draft.loadFollowingsError = null;
        break;
      case LOAD_FOLLOWINGS_SUCCESS:
        draft.loadFollowingsLoading = false;
        draft.me.Followings = action.data;
        draft.loadFollowingsDone = true;
        break;
      case LOAD_FOLLOWINGS_FAILURE:
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = action.error;
        break;
      case REMOVE_FOLLOWER_REQUEST:
        draft.removeFollowerLoading = true;
        draft.removeFollowerDone = false;
        draft.removeFollowerError = null;
        break;
      case REMOVE_FOLLOWER_SUCCESS:
        draft.removeFollowerLoading = false;
        draft.me.Followers = draft.me.Followers.filter((v) => {
          v.id !== action.data.UserId;
        });
        draft.removeFollowerDone = true;
        break;
      case REMOVE_FOLLOWER_FAILURE:
        draft.removeFollowerLoading = false;
        draft.removeFollowerError = action.error;
        break;
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: [{ id: action.data }, ...state.me.Posts],
      //   },
      // };
      case REMOVE_POST_OF_ME:
        draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: state.me.Posts.filter((v) => v.id !== action.data),
      //   },
      // };
      default:
        break;
    }
  });

export default reducer;
