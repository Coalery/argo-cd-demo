import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// 간단한 라우트 설정
app.get("/", (req, res) => {
  res.send("pong!");
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
