// reducer는 함수다! 개발자가 원하는 수정사항에 대한 실제 로직을 이 안에 모두 구현하자!
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

const changeNickName = {
  type: 'CHANGE_NICKNAME',
  data: 'bbanderson',
};

const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE: // HYDRATE: SSR을 위함. 사실상 SSR을 위해 index.js가 필요.
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
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
