// src/pages/Reminders.js
import { useEffect, useState } from "react";
import API from "../services/api";
import ReminderCard from "../components/ReminderCard";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");

  // For editing
  const [editItem, setEditItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editType, setEditType] = useState("Other");

  // ================================
  // Load reminders
  // ================================
  const loadReminders = async () => {
    try {
      const res = await API.get("/reminders");
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  // ================================
  // Add Reminder (smart parser)
  // ================================
  const addReminder = async () => {
    if (!title.trim()) return;

    let extractedTime = null;

    // Extract HH:MM
    const timeMatch = title.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
    if (timeMatch) extractedTime = timeMatch[0];

    // Extract AM/PM
    const ampmMatch = title.match(/\b(\d{1,2})\s?(am|pm)\b/i);
    if (ampmMatch) {
      let hour = parseInt(ampmMatch[1]);
      const period = ampmMatch[2].toLowerCase();

      if (period === "pm" && hour !== 12) hour += 12;
      if (period === "am" && hour === 12) hour = 0;

      extractedTime = `${hour.toString().padStart(2, "0")}:00`;
    }

    const finalTime = extractedTime || "00:00";

    let cleanedTitle = title
      .replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/, "")
      .replace(/\b(\d{1,2})\s?(am|pm)\b/i, "")
      .replace(/at\s+/i, "")
      .trim();

    if (!cleanedTitle) cleanedTitle = "Reminder";

    const today = new Date().toISOString().split("T")[0];

    const res = await API.post("/reminders", {
      title: cleanedTitle,
      date: today,
      time: finalTime,
      type: "Other",
    });

    setReminders([res.data, ...reminders]);
    setTitle("");
  };

  // ================================
  // Open edit modal
  // ================================
  const openEdit = (item) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditTime(item.time || "00:00");
    setEditType(item.type || "Other");
  };

  // ================================
  // Save Edit
  // ================================
  const saveReminder = async () => {
    try {
      const id = editItem._id;

      const res = await API.put(`/reminders/${id}`, {
        title: editTitle,
        time: editTime,
        type: editType,
      });

      setReminders((prev) =>
        prev.map((item) => (item._id === id ? res.data : item))
      );

      setEditItem(null);
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  // ================================
  // Close modal
  // ================================
  const closeModal = () => setEditItem(null);

  // ================================
  // Render
  // ================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          ⏰ Reminders
        </h2>

        {/* Input Box */}
        <div className="flex items-center gap-3 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new reminder..."
            className="flex-grow p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
          />
          <button
            onClick={addReminder}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            Add
          </button>
        </div>

        {/* Reminder List */}
        {reminders.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 mt-10">
            No reminders yet. Add your first one ✅
          </p>
        ) : (
          <div className="space-y-4">
            {reminders.map((r) => (
              <ReminderCard
                key={r._id}
                reminder={r}
                onToggleComplete={async () => {
                  const res = await API.patch(`/reminders/${r._id}`);
                  setReminders((prev) =>
                    prev.map((item) =>
                      item._id === r._id ? res.data : item
                    )
                  );
                }}
                onDelete={async () => {
                  await API.delete(`/reminders/${r._id}`);
                  setReminders((prev) =>
                    prev.filter((item) => item._id !== r._id)
                  );
                }}
                onEdit={() => openEdit(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===========================
          Edit Modal
      =========================== */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96 shadow-xl">

            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Edit Reminder
            </h3>

            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
            />

            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={editTime}
              onChange={(e) => setEditTime(e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
            />

            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
              className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            >
              <option>Other</option>
              <option>Medicine</option>
              <option>Appointment</option>
              <option>Task</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveReminder}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
