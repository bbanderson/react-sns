const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(
  cors({
    origin: true,
    credentials: false,
  })
);
app.use(express.json()); // req.body에 프론트의 데이터를 json 형식으로 담아 줌.
app.use(express.urlencoded({ extended: true })); // urlencoded 방식으로 넘어온 form submit 데이터를 qs 라이브러리로 해독
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
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
app.use("/user", userRouter);

const PORT = 3065;

app.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
