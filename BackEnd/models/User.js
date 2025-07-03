// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcryptjs for password hashing

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      // Renamed from 'password' to 'passwordHash' for clarity
      type: String,
      required: true,
    },
    preferences: {
      currency: { type: String, default: "JPY" }, // Changed default to JPY
      startOfWeek: { type: String, default: "sunday" },
      notificationEnabled: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware (Pre-save hook for password hashing) ---
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("passwordHash")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt); // Hash the password
    next();
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
