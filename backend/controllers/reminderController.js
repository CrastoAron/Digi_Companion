const Reminder = require("../models/Reminder");

// GET all
exports.getAll = async (req, res) => {
  try {
    const items = await Reminder.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("getAll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE
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

// ⭐⭐ ADD THIS ⭐⭐
exports.update = async (req, res) => {
  try {
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ⭐⭐ END ADDITION ⭐⭐


// TOGGLE
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

// DELETE
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
