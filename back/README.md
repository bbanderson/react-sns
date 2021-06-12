# React SNS Backend

##### 1. `npm i sequelize sequelize-cli mysql2`

###### mysql2 : node와 mysql을 연결해주는 드라이버


##### 2. `npx sequelize init` 실행 후 `config.json` 설정
```json5
// /back/config/config.json
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

##### 8. `npm i -D nodemon`