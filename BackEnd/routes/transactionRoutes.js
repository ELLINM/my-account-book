// backend/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
// const auth = require('../middleware/auth'); // To be used later for user authentication middleware

// --- Add a new transaction ---
// POST /api/transactions
// req.body: { type, amount, category, description, date, paymentMethod, memo, isRecurring }
router.post(
  "/",
  /* auth, */ async (req, res) => {
    // 'auth' middleware will be added later
    const {
      type,
      amount,
      category,
      description,
      date,
      paymentMethod,
      memo,
      isRecurring,
    } = req.body;
    // const userId = req.user.id; // Assuming user ID is available from authentication after login

    try {
      // Temporary userId (to be replaced with authenticated user's ID)
      // In a real application, this should be the ID of the logged-in user.
      // Using a hardcoded ID is a security vulnerability in multi-user environments.
      const userId = "66858e7a0000000000000000"; // Replace with an actual User._id or a placeholder for now (e.g., a dummy ObjectId)

      const newTransaction = new Transaction({
        userId,
        type,
        amount,
        category, // category must be an ObjectId
        description,
        date: date ? new Date(date) : new Date(), // Use provided date or current date
        paymentMethod,
        memo,
        isRecurring: isRecurring || false,
      });

      const transaction = await newTransaction.save();
      res.status(201).json(transaction);
    } catch (err) {
      console.error("Error adding transaction:", err);
      // Handle Mongoose validation errors
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Get all transactions (with filtering, pagination, sorting) ---
// GET /api/transactions?userId=...&type=...&category=...&startDate=...&endDate=...&page=...&limit=...&sortBy=...
router.get(
  "/",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // After user authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "date",
      sortOrder = -1,
    } = req.query; // sortOrder: -1 (descending), 1 (ascending)

    const query = { userId }; // Only fetch transactions for the logged-in user

    if (type) {
      query.type = type;
    }
    if (category) {
      // Attempt to convert to Mongoose ObjectId
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const sortOptions = {};
    sortOptions[sortBy] = parseInt(sortOrder);

    try {
      const totalCount = await Transaction.countDocuments(query);
      const transactions = await Transaction.find(query)
        .populate("category") // Populates the 'category' field with actual Category document data
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      res.json({
        transactions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      });
    } catch (err) {
      console.error("Error fetching transactions:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Get a specific transaction by ID ---
// GET /api/transactions/:id
router.get(
  "/:id",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // After user authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId,
      }).populate("category");
      if (!transaction) {
        return res
          .status(404)
          .json({ message: "Transaction not found or not authorized" });
      }
      res.json(transaction);
    } catch (err) {
      console.error("Error fetching single transaction:", err);
      // Handle invalid ObjectId format
      if (err.name === "CastError") {
        return res
          .status(400)
          .json({ message: "Invalid Transaction ID format" });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Update a specific transaction ---
// PUT /api/transactions/:id
router.put(
  "/:id",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // After user authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    const {
      type,
      amount,
      category,
      description,
      date,
      paymentMethod,
      memo,
      isRecurring,
    } = req.body;

    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId,
      });
      if (!transaction) {
        return res
          .status(404)
          .json({ message: "Transaction not found or not authorized" });
      }

      // Update fields if provided in request body
      transaction.type = type || transaction.type;
      transaction.amount = amount || transaction.amount;
      transaction.category = category || transaction.category;
      transaction.description = description || transaction.description;
      transaction.date = date ? new Date(date) : transaction.date;
      transaction.paymentMethod = paymentMethod || transaction.paymentMethod;
      transaction.memo = memo || transaction.memo;
      transaction.isRecurring =
        isRecurring !== undefined ? isRecurring : transaction.isRecurring;

      const updatedTransaction = await transaction.save(); // save() method triggers pre/post save hooks
      res.json(updatedTransaction);
    } catch (err) {
      console.error("Error updating transaction:", err);
      if (err.name === "CastError") {
        return res
          .status(400)
          .json({ message: "Invalid Transaction ID format" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Delete a specific transaction ---
// DELETE /api/transactions/:id
router.delete(
  "/:id",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // After user authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    try {
      // Find and delete the transaction ensuring it belongs to the authenticated user
      const deletedTransaction = await Transaction.findOneAndDelete({
        _id: req.params.id,
        userId,
      });
      if (!deletedTransaction) {
        return res
          .status(404)
          .json({ message: "Transaction not found or not authorized" });
      }
      res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
      console.error("Error deleting transaction:", err);
      if (err.name === "CastError") {
        return res
          .status(400)
          .json({ message: "Invalid Transaction ID format" });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
