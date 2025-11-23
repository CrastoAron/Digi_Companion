// backend/controllers/reminderController.js

const Reminder = require("../models/Reminder");

// ✅ GET all reminders for logged-in user
exports.getAll = async (req, res) => {
  try {
    const items = await Reminder.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("getAll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE a new reminder
exports.create = async (req, res) => {
  try {
    const { title, time, type = "Other" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const reminder = await Reminder.create({
      title,
      time,
      type,
      userId: req.userId
    });

    res.status(201).json(reminder);
  } catch (err) {
    console.error("create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ TOGGLE completion
exports.toggle = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.userId });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.isCompleted = !reminder.isCompleted;
    await reminder.save();

    res.json(reminder);
  } catch (err) {
    console.error("toggle error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE reminder
exports.remove = async (req, res) => {
  try {
    const deleted = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("remove error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
