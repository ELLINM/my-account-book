// backend/server.js
require("dotenv").config(); // .env 파일 로드

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- 미들웨어 설정 ---
app.use(cors()); // CORS 허용 (프론트엔드와 통신 위함)
app.use(express.json()); // JSON 요청 본문 파싱

// --- MongoDB 연결 ---
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // 연결 실패 시 앱 종료
  });

// --- 라우트 정의 (나중에 추가) ---
const transactionRoutes = require("./routes/transactionRoutes");
app.use("/api/transactions", transactionRoutes); // /api/transactions 경로로 라우트 연결

app.get("/", (req, res) => {
  res.send("Account Book API is running!");
});

// --- 서버 시작 ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
