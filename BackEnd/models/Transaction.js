const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User 모델을 참조
      required: true,
      index: true, // 사용자별 쿼리 성능 향상을 위해 인덱싱
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Category 모델을 참조
      required: true,
      index: true, // 카테고리별 쿼리 성능 향상을 위해 인덱싱
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // 날짜별 쿼리 (기간 조회) 성능 향상을 위해 인덱싱
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: "",
    },
    memo: {
      type: String,
      trim: true,
      default: "",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
