module.exports = (sequelize, DataTypes) => {
  // model(테이블) 이름인 Post가 자동으로 소문자복수형이 되어 mysql에 저장된다.
  const Post = sequelize.define(
    "Post",
    // 첫 번째 인자: 스키마
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false, // 필수
      },
    },
    // 두 번째 인자: 세팅값
    {
      charset: "utf8mb4", // 이모티콘까지 포함하려면 utf8mb4로 저장
      collate: "utf8mb4_general_ci", // 한글 저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); // post.addUser, post.removeUser, post.getUser, post.setUser 기본 제공
    db.Post.hasMany(db.Comment); // post.addComments, post.removeComments
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // 리트윗 관리를 위해, 현재 게시글의 원본 id를 RetweetId 컬럼에 저장.
  };
  return Post;
};
