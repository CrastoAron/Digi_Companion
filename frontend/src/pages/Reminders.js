import { useEffect, useState } from "react";
import API from "../services/api";
import ReminderCard from "../components/ReminderCard";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    API.get("/reminders")
      .then((res) => setReminders(res.data))
      .catch(() => {});
  }, []);

  const addReminder = async () => {
    if (!title) return;
    const res = await API.post("/reminders", { title });
    setReminders([res.data, ...reminders]);
    setTitle("");
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={addReminder}>Add</button>

      {reminders.map((r) => (
        <ReminderCard key={r._id} reminder={r} />
      ))}
    </div>
  );
}
