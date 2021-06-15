# React-SNS

##### Client : Browser(3060)
##### Frontend Server : Next.js(3060)
##### Backend Server : Express(3065)
##### Database : MySQL(3306)

```
Next.js를 사용하는 이유는 서버사이드렌더링(SSR)을 편하게 하기 위해서입니다.
SSR이 없어도 클라이언트사이드렌더링(CSR)으로 순수 React 개발을 할 수 있습니다.
하지만 CSR은 단점이 명확합니다.
사이트 첫 화면에 접속하는 상황을 예로 들어볼게요.
```

###### SSR이 없을 때 - 돌고 도는 자원, 그리고 안좋은 사용성
```
Browser -> Front Server : 첫 페이지 요청
Front Server -> Broswer : JSX 반환
Browser -> Front Server : 화면 렌더링 후 유저정보 REQUEST 액션 발행
Front Server -> Backend : API 요청
Backend -> Front Server : json 반환 및 성공/실패 액션 발행
Front Server -> Browser : 결과에 따라 다른 화면 렌더링
```

###### SSR을 적용 시 - 초기 로딩 속도가 빨라 컨텐츠가 빨리 보이는 느낌!
```
Browser -> Front -> Backend : 로그인 + 첫 페이지 정보 요청
Backend -> Front -> Browser : 모든 정보가 들어있어 빠르게 느껴짐!
```

지금은 로그인을 예로 들었지만, 유저정보만 해당되지 않아요.  
메인피드에서 게시글 정보가 보여지기까지  
사용자는 빈 화면을 잠시나마 봐야 하는, 매우 이질적인 상황에 놓이게 됩니다.  
따라서 우리는 SSR을 이용하여 사용자 친화적인 서비스를 만들어 봅시다!

`React`에서 SSR을 손쉽게 도와주는 프레임워크가 바로 `Next.js`입니다.  
바로 출발해 볼까요?

### 0. 사전 준비
`/store/configureStore.js`의 `wrapper`가 전체 `/pages/_app.js`를 감싸도록 만들어 줍시다.  
wrapper가 `/pages/` 디렉토리 내의 각 페이지 파일별로 SSR를 적용해줄 겁니다.

### 1. wrapper에 SSR 메서드 적용하기
원래 `Next.js`에서 SSR을 위한 4가지 메서드를 제공하고 있지만, 이들은 `Redux`와 함께 사용할 때 문제가 있습니다.  
따라서 `next-redux-wrapper`가 제공하는 메서드를 이용합시다.  

새로고침을 하면 로그인이 일시적으로 풀리는 문제 - 서버 인증

```
useEffect를 없앤다.
```

###### 기존 code  
Front Server로 인해 컴포넌트가 마운트 되면,  
그제서야 다시 Front Server의 saga를 통해 유저 정보를 요청합니다.
즉 `useEffect`가 실행되고 API 응답을 받기까지 사용자는 로그인이 풀린 듯한 경험을 해야만 합니다. 
```jsx
const Home = () => {
    // 중략
    useEffect(() => {
      dispatch({
        type: LOAD_USER_REQUEST,
      });
    }, []);
    
    return (
      <>
        {/* 중략 */}
      </>
    );
};

export default Home;
```

#### 발상  
처음에 화면(컴포넌트)을 그릴 때부터 데이터까지 함께 받아올 수 있다면?  
즉, 데이터가 채워진 채로 화면을 렌더링할 수 있다면?

#### 접근  
컴포넌트가 그려지는 것보다 먼저 준비작업이 필요하겠네!

#### 구현  
`wrapper`를 각 페이지마다 import하여 컴포넌트가 미처 반환되기 전에 SSR 메서드부터 실행시키자!  
*`.getInitialProps;`는 쓰이지 않습니다.*
```jsx
const Home = () => {
  // 중략
  return (
    <>
      {/* 중략 */}
    </>
  );
};
export const getServerSideProps = wrapper.getServerSideProps((context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST
  });
});
export default Home;
```

원리  
HYDRATE가 다 한다.
```
App이 맨 처음 실행되면 Redux의 상태는 INIT이다.
이 때는 모든 정보가 리듀서에 정의한 initialState 대로 존재한다.
그 후, wrapper.getServerSideProps() 내부에서 dispatch를 하면,
그 결과(Backend로부터 받은 json 데이터)가 store에 저장된다.
그 데이터를 HYDRATE 내장 액션이 발행(실행)되면서 받는다. 
```

### 2. rootReducer 설정 변경

###### 기존 code

```js
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
```

위 코드대로 하면 HYDRATE로 데이터를 받아올 때부터 기존 rootReducer 자체를 덮어씌우는 것이 아니라,  
index 속성 안에 중첩된 `{ index, user, post }`가 생기게 됩니다.  
따라서 아래와 같이 수정하여 HYDRATE 단계인지 여부에 따라 전체 덮어씌우기가 가능하도록 만들어 줍니다.

#### 수정 code
```js
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post
      });
      return combinedReducer(state, action);
    }
  }
};
```

### 3. REQUEST만 보내고 Backend 응답을 기다리지 않는 문제 해결하기

```js
import { END } from 'redux-saga';

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST
  });
  context.store.dispatch(END); // 내장 액션
  await context.store.sagaTask.toPromise();
});
```

### 4. Front Server와 Backend 간 쿠키 공유 설정

```
Browser는 SSR을 모른다!
```

컴포넌트를 렌더링하는 부분은 Browser와 Front Server가 함께 하지만,  
SSR을 위한 `wrapper.getServerSideProps()`는 Front Server만의 영역입니다.  
그런데 Front Server와 Backend는 포트번호가 다르죠.  
이렇게 도메인이 다르면 기본적으로 쿠키를 공유할 수 없습니다.  
따라서 `{ credentials: true }` 설정이 필요합니다.  
그런데, Backend의 `/app.js`에서 이미 설정을 했는데..?  
```js
// /app.js
app.use(cors({
  origin: 'http://localhost:3060', // Front Server 도메인
  credentials: true,
}))
```

맞습니다.  
그럼 받는 쪽에서 문제가 없다면, 보내는 쪽에서 문제가 있다는 거겠지요?  
SSR을 적용하기 전, CSR에서는 Front Server 이전에 `Browser`에서부터 Backend로 요청을 시작합니다.  
즉 `Browser`가 데이터를 보낼 때, 헤더에 쿠키도 자동으로 담아주는 것이죠.  

하지만 SSR을 적용하여 `wrapper.getServerSideProps()`를 호출하게 되면,  
Browser가 아닌 `Front Server`에서부터 데이터 요청을 보냅니다.  
Browser가 아니고서는 쿠키를 자동으로 보내는 기능이 원래 없어요.  
따라서 우리가 axios로 쿠키를 직접 넣어서 보내주어야 합니다!  
쿠키는 `req.headers`에 들어있습니다.

###### 쓰면 안되는 Code
Front Server는 하나인데 반해, 접속하는 Browser는 여럿이지요.  
아래와 같이 쿠키를 저장하면, 다른 곳에서 접속한 사람이  
기존에 접속한 남의 아이디로 로그인하는 불상사가 벌어지게 됩니다.
```js
import { END } from 'redux-saga';
import axios from 'axios';

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 최초 로그인을 하면서 서버를 갔다오면, 그 이후로 context.req가 존재하게 됩니다.
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = cookie;
  context.store.dispatch({
    type: LOAD_USER_REQUEST
  });
  context.store.dispatch(END); // 내장 액션
  await context.store.sagaTask.toPromise();
});
```
### 🔥 보안상 매우 중요 ⭐
```
Front Server에서 쿠키가 공유되지 못하도록 조심하자!
```
#### 해결책
따라서 아래와 같이 쿠키를 지워주도록 분기처리를 해야 합니다.
```js
import { END } from 'redux-saga';
import axios from 'axios';

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 최초 로그인을 하면서 서버를 갔다오면, 그 이후로 context.req가 존재하게 됩니다.
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    // 실제 요청을 보내는 순간에만 잠깐 저장을 시키고,
    // 직접 쿠키를 서버에 보내지 않는다면 초기화
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_USER_REQUEST
  });
  context.store.dispatch(END); // 내장 액션
  await context.store.sagaTask.toPromise();
});
```

### 5. `getServerSideProps` VS `getStaticProps`
접속한 상황에 따라 화면이 바뀌어야 되면 `getServerSideProps`를,  
동일한 화면을 보여줘도 되면 `getStaticProps`를 사용합니다.  
정적 블로그처럼 한번 쓰면 수정이 빈번하지 않으면 `getStaticProps`가 사용됩니다.  
하지만 실제 웹서비스는 동적인 부분이 많기 때문에, `getServerSideProps`가 자주 쓰입니다.

### 6. 다이나믹 라우팅
```
.
└── pages
    ├── post
    │   └── [id].js
    ├── _app.js
    ├── about.js
    ├── index.js
    ├── profile.js
    └── signup.js
```
`Next.js`의 특장점은 `/pages` 디렉토리 구조가 곧바로 URL로 적용된다는 것입니다.  
만약 파일 이름을 `대괄호[]`로 묶으면 그 파일의 이름은 `req.params`로 접근할 수 있게 됩니다.  
바로 여기서 또 SSR의 존재 이유가 등장하는데요.
1. 상세 페이지라고 하더라도 컴포넌트가 그려지기 전부터 `Backend`에서  
모든 정보를 전송하는 효과를 주기에 `SEO(검색엔진 최적화)`를 노릴 수 있습니다.
2. 또한 이후에 얼마나 많은 게시글이 있을지에 상관없이 동일한 템플릿으로  
쉽게 대응할 수 있습니다.
3. 카톡 등으로 링크 공유 시 `og(open graph)` 적용이 가능합니다.

`/pages/post/[id].js`에서 `wrapper.getServerSideProps()`로 SSR을 적용해 봅시다.

### 7. favicon 추가
```
.
└── public
    └── favicon.ico
```
Front Server의 루트에 `public` 폴더를 만들고, 그 안에 `.ico`, `.png` 등 파일을 추가하면 Browser가 자동으로 로드합니다.