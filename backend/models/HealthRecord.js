// backend/models/HealthRecord.js
const mongoose = require("mongoose");

const HealthRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    heartRate: { type: Number, required: true },
    bloodPressure: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthRecord", HealthRecordSchema);
