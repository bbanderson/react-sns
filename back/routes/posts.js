const express = require("express");
const { Op } = require("sequelize"); // Operator
const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // 여러 게시글 불러오기
  try {
    const where = {}; // 초기 로딩 시 최신수 10개 불러오기(별도 조건 X)
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

module.exports = router;
