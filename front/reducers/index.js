// reducer는 함수다! 개발자가 원하는 수정사항에 대한 실제 로직을 이 안에 모두 구현하자!
import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
