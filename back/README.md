# React SNS Backend

##### 1. `npm i sequelize sequelize-cli mysql2`

###### mysql2 : node와 mysql을 연결해주는 드라이버


##### 2. `npx sequelize init`
```js
///back/config/config.json
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