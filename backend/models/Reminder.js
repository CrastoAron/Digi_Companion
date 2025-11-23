const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    time: { type: String },
    type: { type: String, default: "Other" },
    isCompleted: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", ReminderSchema);
