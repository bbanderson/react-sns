module.exports = (sequelize, DataTypes) => {
  // model(테이블) 이름인 Hashtag가 자동으로 소문자복수형이 되어 mysql에 저장된다.
  const Hashtag = sequelize.define(
    "Hashtag",
    // 첫 번째 인자: 스키마
    {
      content: {
        type: DataTypes.STRING(20),
        allowNull: false, // 필수
      },
    },
    // 두 번째 인자: 세팅값
    {
      charset: "utf8mb4", // 이모티콘까지 포함하려면 utf8mb4로 저장
      collate: "utf8mb4_general_ci", // 한글 저장
    }
  );
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  };
  return Hashtag;
};
