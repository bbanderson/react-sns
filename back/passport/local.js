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
