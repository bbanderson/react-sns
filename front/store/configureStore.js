// configureStore.js
import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, compose, createStore } from 'redux';
import reducer from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const loggerMiddleware =
  // 원래 action은 객체이지만, thunk에서는 함수로 둘 수 있다. 함수를 반환함으로써 나중에 비동기 처리 가능!


    ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      console.log(action);
      return next(action);
    };

const configureStore = () => {
  const middlewares = [thunkMiddleware, loggerMiddleware];
  const enhancer = // 리덕스의 기능이 확장되었으므로 enhancer
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(reducer, enhancer); // store : state와 reducer의 통칭
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
