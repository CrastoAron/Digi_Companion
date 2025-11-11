// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/test", (req, res) => res.send("Hello from backend"));

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
