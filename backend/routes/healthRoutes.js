// backend/routes/healthRoutes.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/healthController");
const auth = require("../middleware/authMiddleware");

// GET all health records
router.get("/", auth, controller.getAll);

// Create new health record
router.post("/", auth, controller.create);

// Update an existing record
router.patch("/:id", auth, controller.update);

// Delete a record
router.delete("/:id", auth, controller.remove);

module.exports = router;
