// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (excluding passwordHash)
      req.user = await User.findById(decoded.id).select("-passwordHash");

      next(); // Proceed to the next middleware/route handler
    } catch (err) {
      console.error("Token verification failed:", err.message);
      res.status(401).json({ message: "Not authorized, token failed" }); // Token is invalid or expired
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" }); // No token provided
  }
};

module.exports = { protect };
