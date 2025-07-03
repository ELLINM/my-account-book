// backend/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
// const auth = require('../middleware/auth'); // To be used later for user authentication middleware

// --- Add a new category ---
// POST /api/categories
// req.body: { name, type, icon, order }
router.post(
  "/",
  /* auth, */ async (req, res) => {
    const { name, type, icon, order } = req.body;
    // const userId = req.user.id; // Assuming user ID is available from authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId (replace with actual User._id)

    try {
      const newCategory = new Category({
        userId,
        name,
        type,
        icon: icon || "",
        order: order || 0,
      });

      const category = await newCategory.save();
      res.status(201).json(category);
    } catch (err) {
      console.error("Error adding category:", err);
      if (err.code === 11000) {
        // MongoDB duplicate key error (for unique index)
        return res
          .status(400)
          .json({
            message: "Category with this name already exists for this user.",
          });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Get all categories for a user ---
// GET /api/categories?type=...
router.get(
  "/",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // Assuming user ID from authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    const query = { userId };
    if (req.query.type) {
      query.type = req.query.type; // Filter by type (income/expense)
    }

    try {
      const categories = await Category.find(query).sort({ order: 1, name: 1 }); // Sort by order then name
      res.json(categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Get a specific category by ID ---
// GET /api/categories/:id
router.get(
  "/:id",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // Assuming user ID from authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    try {
      const category = await Category.findOne({ _id: req.params.id, userId });
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found or not authorized" });
      }
      res.json(category);
    } catch (err) {
      console.error("Error fetching single category:", err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid Category ID format" });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Update a specific category ---
// PUT /api/categories/:id
// req.body: { name, type, icon, order } (any of these)
router.put(
  "/:id",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // Assuming user ID from authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    const { name, type, icon, order } = req.body;

    try {
      const category = await Category.findOne({ _id: req.params.id, userId });
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found or not authorized" });
      }

      // Update fields if provided
      category.name = name || category.name;
      category.type = type || category.type;
      category.icon = icon !== undefined ? icon : category.icon; // Allow empty string for icon
      category.order = order !== undefined ? order : category.order;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } catch (err) {
      console.error("Error updating category:", err);
      if (err.code === 11000) {
        return res
          .status(400)
          .json({
            message: "Category with this name already exists for this user.",
          });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid Category ID format" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// --- Delete a specific category ---
// DELETE /api/categories/:id
router.delete(
  "/:id",
  /* auth, */ async (req, res) => {
    // const userId = req.user.id; // Assuming user ID from authentication
    const userId = "66858e7a0000000000000000"; // Temporary userId

    try {
      // Before deleting a category, consider if there are transactions referencing it.
      // You might want to:
      // 1. Prevent deletion if referenced by transactions.
      // 2. Set 'category' field in referencing transactions to null/default, or delete them.
      // For now, we'll just delete the category.
      // const Transaction = require('../models/Transaction');
      // await Transaction.updateMany({ category: req.params.id }, { $unset: { category: 1 } }); // Example: unset category from transactions

      const deletedCategory = await Category.findOneAndDelete({
        _id: req.params.id,
        userId,
      });
      if (!deletedCategory) {
        return res
          .status(404)
          .json({ message: "Category not found or not authorized" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (err) {
      console.error("Error deleting category:", err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid Category ID format" });
      }
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
