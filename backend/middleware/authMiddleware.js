// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

// ✅ use SAME secret as login — prevents mismatch
const SECRET = process.env.JWT_SECRET || "yourSecretKey";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET); // ✅ FIXED
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
