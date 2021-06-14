const express = require("express");
const { Post, User, Image, Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // 여러 게시글 불러오기
  try {
    const posts = await Post.findAll({
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
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
