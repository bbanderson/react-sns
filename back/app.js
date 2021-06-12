const express = require("express");
const postRouter = require("./routes/post");

const app = express();

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

const PORT = 3065;

app.listen(PORT, () => {
  console.log(`서버 실행 중 http://localhost:${PORT}`);
});
