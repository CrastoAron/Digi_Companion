// backend/routes/reminderRoutes.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/reminderController");
const auth = require("../middleware/authMiddleware");

// ✅ GET all reminders
router.get("/", auth, controller.getAll);

// ✅ CREATE new reminder
router.post("/", auth, controller.create);

// ✅ TOGGLE completion
router.patch("/:id", auth, controller.toggle);

// ✅ DELETE reminder
router.delete("/:id", auth, controller.remove);

module.exports = router;
