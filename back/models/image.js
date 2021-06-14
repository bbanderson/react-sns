module.exports = (sequelize, DataTypes) => {
  // model(테이블) 이름인 Image가 자동으로 소문자복수형이 되어 mysql에 저장된다.
  const Image = sequelize.define(
    "Image",
    // 첫 번째 인자: 스키마
    {
      src: {
        type: DataTypes.STRING(200), // 이미지는 URL이기 때문에 넉넉하게 잡는다.
        allowNull: false, // 필수
      },
    },
    // 두 번째 인자: 세팅값
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 이모티콘 저장
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
};
