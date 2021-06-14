# React SNS Backend

```
행동강령
1. async~await 로직을 구현할 때는 try~catch로 예외처리를 하자.
2. error는 console.error로 찍어보자.
3. 서버 통신을 점검할 때는 네트워크 탭을 꼼꼼히 읽자(Method 켜기).
4. 사용자 중에는 해커도 있으므로 Browser와 Front Server를 믿지 말자.
5. 성능 개선을 위해, 작성글/팔로워 등 개수만 필요한 경우 id만 가져오자.
6. 유저 정보를 조회할 때, Front에 비밀번호를 전송하지 않도록 주의하자.
7. 현재 사용자 id는 req.user에 들어 있으므로, 프론트에서 보낼 필요없다.
8. map 안의 콜백함수(onClick 등)에 데이터를 넣고 싶다면, 고차함수로 만들자.
9. formData는 이미지 등 multipart가 아니면 필요없으며, 구조분해 하지말자.
10. 파일은 S3로, 파일경로는 DB로 따로 관리하여 CDN 캐싱 등 이점을 노린다.  
```

##### 1. `npm i sequelize sequelize-cli mysql2`

###### mysql2 : node와 mysql을 연결해주는 드라이버


##### 2. `npx sequelize init` 실행 후 `config.json` 설정
```json5
// /back/config/config.js
{
  "development": {
    "username": "root",
    "password": "11111111",
    "database": "react-sns",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```

##### 3. 모델 생성
###### RDBMS에서의 테이블 === sequelize에서의 model
```
.
├── node_modules
├── .env
├── README.md
├── package-lock.json
├── package.json
├── app.js
├── routes
│   └── post.js
├── config
│   └── config.json
├── migrations
├── seeders
└── models
    ├── index.js
    ├── user.js
    ├── post.js
    ├── image.js
    ├── hashtag.js
    └── comment.js
```

##### 4. 관계 설정
###### hasMany <-> belongsTo
- **belongsTo는 실제 테이블에서 외래키 컬럼이 생성됩니다(hasMany가 있는 테이블에는 원자성을 지키기 위해 생성되지 않음)**
- **외래키를 두고 싶은 곳에 belongsTo를 둘 것**
- **다대다 관계는 모두 belongsToMany로 설정**  
- **다대다 관계는 각 테이블의 외래키를 가진 중간 테이블이 별도 생성된다(sequelize가 자동으로 생성)**
- **through 속성으로 테이블 이름 따로 설정하면 직관적!**
- **as(별칭) 속성으로 belongsTo & belongsToMany 겹칠 때 헷갈리지 않고 데이터 불러올 수 있다!**
- **through : 중간 테이블명 바꿔주기 !== as : 컬럼명 바꿔주기**
```
[프로필] 유저 1 : 동일유저정보 1
[글작성] 유저 1 : 게시글 many
[리트윗] 게시글 1 : 게시글 many // 원본 1개에서 파생된 복제글 여럿
[코멘트] 유저 1 : 댓글 many
[코멘트] 게시글 1 : 댓글 many
[팔로잉] 유저 many : 유저 many // foreignKey 속성으로 별칭 붙여주기
[해시태그] 게시글 many : 해시태그 many
```

##### 5. 정의한 `model`을 `sequelize(models/index.js)`에 등록하기
```js
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize( // node와 mysql을 연결(sequelize는 내부적으로 mysql2를 사용)
  config.database,
  config.username,
  config.password,
  config
);

db.Comment = require("./comment")(sequelize, Sequelize);
db.Hashtag = require("./hashtag")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.User = require("./user")(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  // 위에서 각각 정의한 model의 관계를 설정
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
```
##### 6. `app.js`에 `sequelize` 등록하기
```js
const express = require("express");
const postRouter = require("./routes/post");
const db = require("./models");
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/api", (req, res) => {
  res.send("hello api");
});

app.get("/posts", (req, res) => {
  res.json([{ id: 1, content: "hello" }]);
});

app.use("/post", postRouter);

const PORT = 3065;

app.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
```

##### 7. `npx sequelize db:create`로 데이터베이스에 database(schema) 등록하기

##### 8. `npm i bcrypt`로 비밀번호 해싱하여 저장하기

##### 9. CORS
**브라우저의 보안 장치일 뿐! 서로 다른 서버(컴퓨터) 간에는 상관 없음!**
**`Browser(Client)와 Front Server` 또는 `Front Server와 Backend Server` 사이에는 CORS 에러가 발생하지 않는다.**
```
URL + PORT가 다르면 보안상 자원 공유를 하지 못하도록 브라우저가 보호해 주는 로직.
보편적인 경우, 해킹이 아니라면 사용자의 브라우저를 조작할 수 없기에 톡톡한 보안 역할을 함.
```

###### 해결책

1. **Proxy 방식**  
브라우저와 프론트서버는 같은 도메인이기 때문에 CORS 에러가 애초에 발생하지 않으며,
   CORS 에러는 원래 브라우저에서 관리하기 때문에, 브라우저가 아닌 환경에서는 도메인이 달라도 자원 공유가 상관없음을 이용.
```
Browser(Client, :3060) <-> Front Server(:3060) <-> Backend Server(:3065)
```
2. **서버에서 Response Header에 `Access-Control-Allow-Origin` 설정하기**  
초기 차단은 브라우저가 하되, 서버에서 허용하는 방식
```js
const apiUrl = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3060'); // 두번째 인자를 '*'로 하면 전체 도메인 허용
  res.status(200).send('ok');
};
```

3. **`npm i cors` 미들웨어로 편하게 처리하기**
```js
app.use(cors({
  origin: '*', // origin: true로 하면 요청한 주소가 자동으로 대입됨.
  credentials: false, // 기본값이 false이지만 꼭 적어주어야 
}))
```

##### 10. Front Server의 axios 중복 URL 분리
###### 서버에 요청할 때는 항상 try~catch로 감싼 후 await 처리를 잊지 말자
```js
// /front/sagas/index.js
axios.defaults.baseURL = 'http://localhost:3065';
```

##### 11. passport 설정
`npm i passport passport-local`

```
.
├── app.js
├── passport
│   ├── index.js
│   └── local.js
└── routes
    ├── post.js
    └── user.js
```
###### 로그인 과정
```
1. 사용자가 로그인 폼에 정보 입력 후 Submit 클릭
2. LOG_IN_REQUEST 액션 발행 및 dispatch
3. watch중이던 redux-saga가 logInAPI 호출하면서 서버로 폼 데이터 전송
4. 서버는 logInAPI 주소를 통해 req.body로 데이터를 받아옴
5. passport.authenticate를 호출하면서 해당 전략을 실행 
6. 각 전략에서 DB를 조회하면서 성공/실패 여부에 따라 done 분기처리
7. done 결과를 passport.authenticate에서 다시 받아옴
8. logInAPI 라우터에서 성공/실패 여부에 따라 res객체에 상태코드 또는 데이터 json 담기
```
###### 코드 구현
```js
// /app.js
const express = require("express");
const cors = require("cors");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");
const app = express();

db.sequelize
.sync()
.then(() => {
   console.log("db 연결 성공");
})
.catch(console.error);

passportConfig();

app.use(
        cors({
           origin: true,
           credentials: false,
        })
);
app.use(express.json()); // req.body에 프론트의 데이터를 json 형식으로 담아 줌.
app.use(express.urlencoded({ extended: true })); // urlencoded 방식으로 넘어온 form submit 데이터를 qs 라이브러리로 해독
app.use(session());
app.use(passport.initialize());
app.use(passport.session());

app.use("/post", postRouter);
app.use("/user", userRouter);

const PORT = 3065;

app.listen(PORT, () => {
   console.log(`서버 실행 중 http://localhost:${PORT}`);
});
```
```js
// /passport/index.js
const passport = require("passport");
const local = require("./local");
module.exports = () => {
  passport.serializeUser(() => {});
  passport.deserializeUser(() => {});

  local();
};
```
```js
// /passport/local.js
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local"); // 다른 전략과 쉬운 구별을 위해 구조분해 이름변경
const bcrypt = require("bcrypt");

const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      // 첫 번째 인자 : req.body에 대한 설정
      {
        usernameField: "email", // req.body.email에서 email에 해당.
        passwordField: "password", // req.body.password에서 password에 해당.
      },
      // 두 번째 인자 : 로그인 전략 세우기
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            // passport에서는 res로 직접 응답을 보내지 않고, 일단 done으로 결과를 판단한다!
            // done(서버에러, 성공여부, 클라이언트에러(보내는 측에서 잘못 보낸 경우))

            // 1단계 : 이메일부터 원래 존재하는지 판단
            return done(null, false, { reason: "존재하지 않는 이메일입니다." });
          }

          // 2단계 : 이메일이 있다면 비밀번호 일치 확인
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
```
```js
// /routes/user.js
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const passport = require("passport");

const router = express.Router();

router.post("/login", (req, res, next) => {
  // 미들웨어 확장
  passport.authenticate("local", (err, user, info) => {
    // 서버에서 에러가 난 경우 - 서버가 꺼져 있거나 기타 오류가 있는 경우
    if (err) {
      console.error(err); // 에러는 콘솔에 찍는 습관을 들이자.
      return next(err);
    }
    // 클라에서 에러가 난 경우 - 계정 정보를 잘못 입력한 경우
    if (info) {
      console.error(info);
      return res.status(401).send(info.reason); // 401 : 허가되지 않은 접근(로그인 실패 등), 403: 금지
    }

    // 우리가 사전 정의한 위 예외사항에 걸리지 않는다면, 드디어 passport로 로그인할 수 있다.
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        // passport 측에서 발생하는 오류 - 웬만해서는 거의 겪어보기 힘들지만, 혹시 모르니 분기처리
        console.error(loginErr);
        return next(loginErr);
      }
      return res.status(200).json(user); // ✅ 모든 예외사항을 통과함!! 드디어 로그인에 성공했기에 클라이언트에 사용자 정보를 json으로 넘겨주기!
    });
  })(req, res, next);
});

router.post("/", async (req, res, next) => {
  // POST /post
  try {
    const exUser = await User.findOne({ where: { email: req.body.email } }); // 기존 유저가 없다면 null 반환
    if (exUser) {
      // 요청과 응답은 헤더(상태, 용량, 시간, 쿠키)와 바디(데이터)로 구성되어 있다.
      // 4xx : 클라이언트의 잘못된 요청, 5xx : 서버의 잘못된 처리
      return res.status(403).send("이미 사용중인 아이디입니다."); // return 필수(response 중복 방지)
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 10~13이 1초 정도로 적절
    await User.create({
      email: req.body.email,
      nickname: req.body.nickName,
      password: hashedPassword,
    });
    res.status(201).send("ok"); // 200 : 성공함, 201 : 잘 생성됨(더 구체적인 의미).
  } catch (error) {
    console.error(error);
    next(error); // next로 넘기는 에러는 status 500
  }
});

router.post("/login");

router.delete("/", (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
```

##### 12. 쿠키/세션 설정
`npm i express-session cookie-parser`  
로그인을 하면, Browser와 Server는 같은 정보를 들고 있어야 한다.  
그렇다고 DB가 가진 유저 정보를 Front Server에 그대로 전송하기에는 보안에 취약하다.  
따라서 Backend Server는 Front Server에 실제 유저 정보를 랜덤 문자열(토큰)로 치환하여 보낸다.
이후 Browser의 요청이 있을 때마다 해당 토큰을 쿠키에 담아 전송하고,   
Backend Server는 기존 발급한 토큰과 일치하는지 판단하여 인증하게 된다.
```
// passport.authenticate 내부에서 req.login 호출 시 자동 생성
// Response Header의 Set-Cookie: connect.sid=zskf@if0a9sdj로 들어감
res.setHeader('Cookie', 'zskf@if0a9sdj')
```
그런데, 각 유저의 모든 정보를 쿠키에 담는다면 동접자가 많을 경우  
서버 메모리가 버티지 못할 것이다.  
`아이디, 이메일, 비밀번호, 결제내역, 카드정보 등등`  
그래서 passport는 아이디어를 냈다.  
쿠키에 모든 정보를 다 넣는 것이 아니라,  
DB를 조회할 수 있는 id만 매칭시켜서 그때그때 로딩하게 하는 것이다.  
`실서비스에서는 아예 세션 저장용 DB로 redis를 사용`
```js
app.use(cookieParser());
app.use(session());
app.use(passport.initialize());
app.use(passport.session());
```
###### 로그인
`return req.login(user, cb)`이 실행되면,  
동시에 `serializeUser(cb)`가 실행된다.
```js
// 유저 정보 중에서 쿠키랑 매칭할 DB id만 저장하는 로직
// 로그인에 성공해야 실행된다.
passport.serializeUser((user, done) => {
  done(null, user.id); // 유저의 id값을 쿠키에 넣어줌.
});
```
```js
// 클라이언트가 전송한 쿠키 속 id 값을 통해 DB를 조회하는 로직
// 로그인에 일단 성공하면, 그 다음 요청부터 매번 실행된다.
// 모든 라우터가 실행되기 전에 이 함수가 실행된다.
// req.user에서 실제 데이터 참조 -> 게시글 생성/수정/삭제 권한 부여
// passport.serializeUser로 암호화된 데이터를 이용하여 복호화
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    done(null, user); // 실제 데이터를 req.user에 넣어줌.
  } catch (error) {
     console.error(error);
     done(error);
  }
});
```

###### 로그아웃
세션과 쿠키를 삭제하기만 하면 끝!
```js
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
})
```

##### 13. dotenv 적용
```js
const dotenv = require('dotenv');
dotenv.config();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
   saveUninitialized: false,
   resave: false,
   secret: process.env.COOKIE_SECRET,
}));
```
```js
// /config/config.json -> /config/config.js로 변경

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "react-sns",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
```
##### 14. 라우터 검사용 미들웨어 장착
node.js의 꽃은 미들웨어 응용!  
함수와 함수 사이에 커스텀 로직을 만들자!
```js
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};
```
next()에 인자가 없다면 바로 다음 미들웨어로 이동,  
next()에 인자가 있다면 에러처리 전용 미들웨어로 이동.  
에러처리 미들웨어는 따로 만들지 않아도 node.js에서 기본으로 제공하지만,  
커스텀 처리(에러 페이지 이동 등)가 필요하다면 아래와 같이 생성한다.  
*에러처리 미들웨어는 모든 라우터와 app.listen() 사이에 위치한다.*
```js
app.use((err, req, res, next) => {
  // 나만의 커스텀 에러처리 로직
});
```

##### 15. CORS { credentials: true } 설정 - `401 error`
Browser는 도메인이 다르면 자원 공유를 할 수 없도록 차단한다.  
Browser와 Backend Server는 포트가 달라 도메인도 다르다.  
따라서 로그인 이후의 요청들에 대해서도 라우터 간 쿠키를 공유해야 `401`에러가 뜨지 않는다.  
###### 해결책 - CORS 설정
**Backend Server**  
`cors` 모듈의 옵션 중 `credentials`을 `true`로 변경하여 쿠키 공유를 허용한다(기본값은 false).
```js
// /app.js
app.use(cors({
   origin: "http://localhost:3060", // origin: true도 가능
   credentials: true
}));
```
**Front Server**  
`axios` GET/DELETE 요청을 보낼 때, 2번째 인자로 `{ withCredentials: true }` 옵션을 추가한다.  
`axios` POST 요청을 보낼 때, 3번째 인자로 `{ withCredentials: true }` 옵션을 추가한다.
```js
// /sagas/user.js (front)
axios.get('/user', {
  withCredentials: true
});
```
```js
// /sagas/post.js (front)
axios.post('/post', { content: data }, {
  withCredentials: true
});
```
OR  
Front Server의 `/sagas/index.js`에서 도메인과 함께 한번에 관리한다.
```js
// /sagas/index.js
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;
```
**단, 로그인 유지를 제대로 구현하려면 SSR이 필요하다.**  

##### 16. API 연결을 위한 Saga Time!
액션을 계속 생성하게 될 것이다!

##### 17. `multer`로 `multipart/form-data`처리
아래 두가지는 `multipart` 데이터 형식(파일/이미지/동영상)을 처리하지 못한다.  
```js
// /app.js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
따라서 이미지 업로드를 위해서는 `multer` 미들웨어가 별도로 필요하다.  
```
npm i multer
```

`multer` 모듈은 Backend Server의 최상위에 위치한 `/app.js`에서  
물론 import 할 수 있다.  
하지만 폼마다 전송하고자 하는 데이터 형식이 다르기 때문에,  
주로 각 라우터마다 미들웨어로서 따로 장착해주는 패턴을 따른다.  
**이미지/동영상은 서버 리소스에 부담을 주기 때문에,  
대규모 실무에서는 Front에서 Cloud로 직접 올리는 방식을 취한다.**
```js
const upload = multer({
   // 저장소 옵션
   storage: multer.diskStorage({ // 로컬 디스크 이용
      destination(req, file, done) { // 목적지 설정
        done(null, 'uploads'); // /uploads 폴더 선택(fs 모듈로 사전 생성 필요!)
      },
      filename(req, file, done) { // 파일명 설정
        // 파일 확장자 추출
        const ext = path.extname(file.originalname);
        // 확장자 제외한 파일명 추출
        const basename = path.basename(file.originalname, ext);
        // 파일명 중복을 피하기 위해 밀리초 단위 삽입 -> overwrite 방지
        done(null, basename + new Date().getTime() + ext)
      }
   }),
   // 파일 용량을 제한함으로써 서버 공격 방지
   limits: { fileSize: 20 * 1024 * 1024 } // 20MB
})

router.post(
  '/images',
  isLoggedIn,
  // single: 단일 파일, array: 한개 input 여러 파일
  // fields: 여러 input 여러 file, none: 텍스트/json
  upload.array('image'), // JSX form name의 value
  (req, res, next) => {

})
```

###### 업로드 프로세스 2가지
1. **폼 전송 시 이미지를 포함한 모든 폼 데이터를 한번에 올리는 방식**   
`장점` : Backend에서 개발하기에 간단하다.  
`단점` : 업로드를 모두 마친 후에야 기타 컨텐츠 수정 및 이미지 미리보기/리사이징/보정/머신러닝이 가능하기 때문에,
오래 걸리고 동시 작업이 어렵다.<br/><br/>
2. **이미지만 먼저 선택하여 서버에 선 업로드하는 방식**  
`장점` : 용량이 커서 오래 걸리는 이미지 전송을 먼저 처리한 후,  
서버 업로드가 완료되면 파일명 반환과 함께 미리보기/리사이징 백그라운드 처리가 완료됨.  
따라서, 사용자는 프론트에서 나머지 정보를 동시에 기입하는 효율성을 갖게 됨.  
`단점` : 요청이 2번 왔다갔다 하기 때문에, 구현이 복잡함.  
도중에 취소하더라도 이미지는 이미 올라가있기 때문에, 서버의 용량을 차지함.  
   하지만 이후 머신러닝 등에 이용할 수 있는 자산이 되므로 꼭 단점까지는 아님.
```
이미지 관리 비용 < 이미지 보유 가치
```

###### ❗️주의사항
**`new FormData()`는 `axios.post('/api/route/', {key: value}` 형태로 감싸면 안된다!**  
**{}로 묶는 순간 json이 되기 때문에 `multipart` 데이터 형식이 깨지게 된다.**
---
##### 18. 이미지 미리보기를 위한 static 처리
Backend Server에 이미지 업로드를 성공하고 나면,  
Front Server는 해당 이미지의 Backend Server 내 업로드 경로를 반환받는다.  
하지만 Browser가 이에 접근하려면 다음 2가지 설정을 해주어야 한다.  
1. **Front Server**  
   `JSX`의 `<img />` `src` 속성에 Backend Server 도메인을 포트까지 일치시킨다.
   ```jsx
    const onChangeImages = useCallback((e) => {
      // 이미지 업로드 대화상자에서 확인/취소를 클릭한 경우 호출됨
      console.log('images', e.target.files); // e.target.files는 배열이 아니라 유사배열임.
      const imageFormData = new FormData(); // FormData(): multipart 형식으로 전송해 준다.
      [].forEach.call(e.target.files, (f) => {
        // 유사배열 처리하고자 배열의 형식 빌려쓰기
        // key: image, value: f
        // Backend Server에서 req.files로 접근한다.
        // 만약 이미지가 아닌 텍스트/json인 경우,
        // upload.none()으로 req.body.image 형태로 접근한다.
        imageFormData.append('image', f);
      });
      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
    });
   // 중략
   {imagePaths.map(v => (
     <div key={v}>
       <img src={`http://localhost:3065/${v}`} />
     </div>
   ))}
   ```
2. **Backend Server**  
   `/app.js`에서 `static` 경로 설정을 추가한다.  
   *Browser에서 Backend Server의 폴더 구조를 알 수 없게 한다!*
   ```js
   // path.join() : 운영체제에 맞게 경로 구분자 생성
   // express.static()의 첫번째 인자 : 요청한 URL 포트번호까지 포함
   // 이 예제에서는 http://localhost:3065까지 포함
   // Browser에서는 Backend Server의 URL이 노출되어도,
   // 그 이후의 /uploads를 알 방법이 없다.
   app.use(express.static('/', path.join(__dirname, 'uploads')))
   ```
