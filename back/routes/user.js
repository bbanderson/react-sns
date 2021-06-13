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

router.post("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.delete("/", (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
