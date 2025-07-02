// backend/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// 모든 트랜잭션 가져오기
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 }); // 최신순 정렬
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 새 트랜잭션 추가
router.post("/", async (req, res) => {
  const transaction = new Transaction({
    // userId: req.body.userId, // 사용자 ID가 있다면
    type: req.body.type,
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description,
    date: req.body.date || Date.now(),
    paymentMethod: req.body.paymentMethod,
    memo: req.body.memo,
  });

  try {
    const newTransaction = await transaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 특정 트랜잭션 가져오기 (ID 기준)
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 트랜잭션 업데이트
router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // 업데이트된 문서 반환, 스키마 유효성 검사
    );
    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 트랜잭션 삭제
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTransaction)
      return res.status(404).json({ message: "Transaction not found" });
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
