const express = require("express");
const bcrypt = require("bcrypt");
const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const passport = require("passport");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET /user
  // console.log(req.headers);
  try {
    // 로그인 여부 판단
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          { model: User, as: "Followers", attributes: ["id", "nickname"] },
          { model: User, as: "Followings", attributes: ["id", "nickname"] },
          { model: Post, attributes: ["id"] },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
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
      // ✅ 모든 예외사항을 통과함!! 드디어 로그인에 성공했기에 클라이언트에 사용자 정보를 json으로 넘겨주기!
      // 이 user는 saga에서 호출한 logInAPI의 반환값이 되고, 이어서 LOG_IN_SUCCESS 액션의 데이터가 되며,
      // reducer에서는 action.data가 된다. 이 프로젝트에서는 reducer의 user.me에 데이터가 들어가게 된다.
      // 기존 user에는 password는 들어있으면서 꼭 필요한 기타 정보가 없으므로, 완전한 유저 정보를 다시 로드.
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
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

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  // PATCH /user/nickname
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 나부터 찾기
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/1
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("없는 사람을 차단하시게요?");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  // GET /user/1
  try {
    // 로그인 여부 판단
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        { model: User, as: "Followers", attributes: ["id"] },
        { model: User, as: "Followings", attributes: ["id"] },
        { model: Post, attributes: ["id"] },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      data.Posts = data.Posts.length; // 개인정보 침해 예방
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  // 해당 사용자의 여러 게시글 불러오기
  try {
    const where = { UserId: req.params.userId }; // 초기 로딩 시 최신수 10개 불러오기(별도 조건 X)
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때 실행 이어서 10개 불러오기 -> lastId보다 작은 id를 불러오기
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10, // 1회 요청당 개수 제한
      // offset: 1, // 시작점, 사용자가 게시글 추가/삭제 시 전체 배열이 꼬이기 때문에 실무에서는 사용하지 않음.
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"], // include된 테이블의 정렬은 3개의 원소로 표현!
      ],
      include: [
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        { model: User, as: "Likers", attributes: ["id"] },
        {
          model: Post,
          as: "Retweet", // Post.Retweet
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // 유령회원인지 확인
    if (!user) {
      return res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    await user.addFollowers(req.user.id); // 상대방 기준으로 나는 팔로워이므로, 그 정보에 나의 아이디 추가
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } }); // 유령회원인지 확인
    if (!user) {
      return res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/", (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
