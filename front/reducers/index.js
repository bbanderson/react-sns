// reducer는 함수다! 개발자가 원하는 수정사항에 대한 실제 로직을 이 안에 모두 구현하자!
import { HYDRATE } from 'next-redux-wrapper';
const initialState = {
  user: {
    isLoggedIn: false,
    user: null,
    signUpData: {},
    loginData: {},
  },
  posts: {
    mainPosts: [],
  },
};

export const loginAction = (data) => {
  return {
    type: 'LOG_IN',
    data,
  };
};

export const logoutAction = () => {
  return {
    type: 'LOG_OUT',
  };
};

const changeNickName = {
  type: 'CHANGE_NICKNAME',
  data: 'bbanderson',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return {
        ...state,
        ...action.payload,
      };
    case 'CHANGE_NICKNAME':
      return {
        ...state,
        name: action.name,
      };
    case 'LOG_IN':
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: true,
          user: action.data,
        },
      };
    case 'LOG_OUT':
      return {
        ...state,
        user: {
          ...state.user,
          isLoggedIn: false,
          user: null,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
