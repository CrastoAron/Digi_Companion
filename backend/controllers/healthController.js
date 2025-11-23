// backend/controllers/healthController.js

const HealthRecord = require("../models/HealthRecord");

// ✅ GET all health records for logged-in user
exports.getAll = async (req, res) => {
  try {
    const items = await HealthRecord.find({ userId: req.userId }).sort({ timestamp: 1 });
    res.json(items);
  } catch (err) {
    console.error("Health getAll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CREATE a new record
exports.create = async (req, res) => {
  try {
    const { heartRate, bloodPressure } = req.body;

    if (!heartRate || !bloodPressure) {
      return res.status(400).json({ message: "Heart rate and blood pressure are required" });
    }

    const record = await HealthRecord.create({
      userId: req.userId,
      heartRate,
      bloodPressure,
    });

    res.status(201).json(record);
  } catch (err) {
    console.error("Health create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE an existing record
exports.update = async (req, res) => {
  try {
    const { heartRate, bloodPressure } = req.body;

    const record = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { heartRate, bloodPressure },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    console.error("Health update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE a record
exports.remove = async (req, res) => {
  try {
    const deleted = await HealthRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Health delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
