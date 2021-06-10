export const initialState = {
  isLoggingIn: false, // 로그인 시도 중
  isLoggedIn: false,
  logInError: null,
  isLoggingOut: false, // 로그아웃 시도 중
  isLoggedOut: false,
  logOutError: null,
  isSigningUp: false, // 회원가입 시도 중
  isSignedUp: false,
  signUpError: null,
  me: null,
  signUpData: {},
  logInData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

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
  nickname: data.nickname,
  Posts: [], // 추후 Sequelize로 데이터를 합칠 것은 대문자로 입력.
  Followings: [],
  Followers: [],
});
export const loginRequestAction = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};
export const loginSuccessAction = (data) => {
  return {
    type: 'LOG_IN_SUCCESS',
    data,
  };
};
export const loginFailureAction = (data) => {
  return {
    type: 'LOG_IN_FAILURE',
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: 'LOG_OUT_REQUEST',
  };
};
export const logoutSuccessAction = () => {
  return {
    type: 'LOG_OUT_SUCCESS',
  };
};
export const logoutFailureAction = () => {
  return {
    type: 'LOG_OUT_FAILURE',
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      console.log('REDUCER Login 💖');
      return {
        ...state,
        isLoggingIn: true,
        isLoggedIn: false,
        logInError: null, // 로딩할 때는 에러를 없앤다. 로딩창에서
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: dummyUser(),
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        logInError: action.error,
      };
    case LOG_OUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        isLoggedOut: false,
        logOutError: null,
      };
    case LOG_OUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isLoggedOut: true,
        me: null,
      };
    case LOG_OUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        logOutError: action.error,
      };
    case SIGN_UP_REQUEST:
      return {
        ...state,
        isSigningUp: true,
        isSignedUp: false,
        signUpError: null,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isSigningUp: false,
        isSignedUp: true,
        me: null,
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        isSigningUp: false,
        signUpError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
