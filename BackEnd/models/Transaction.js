// backend/models/Transaction.js
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      // User ID for the associated user
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the 'User' model
      required: true,
      index: true, // Index for improved query performance by user
    },
    type: {
      type: String,
      enum: ["income", "expense"], // Type of transaction: income or expense
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Amount must be non-negative
    },
    category: {
      // Category ID for the associated category
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the 'Category' model
      required: true,
      index: true, // Index for improved query performance by category
    },
    description: {
      type: String,
      trim: true,
      default: "", // Default value
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, // Default to current date if not provided
      index: true, // Index for improved query performance by date (e.g., date range queries)
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
      default: false, // Indicates if it's a recurring transaction
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
