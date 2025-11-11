import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrap">
      <div className="hero">
        <div>
          <h1>Welcome{user ? `, ${user.name || user.email}` : ""} 👋</h1>
          <p>Manage reminders, health charts and talk to your assistant.</p>
        </div>
      </div>

      <div className="grid">
        <div className="card" onClick={() => navigate("/reminders")}>
          <div className="big-emoji">⏰</div>
          <h3>Reminders</h3>
          <p>Set medication and appointment reminders.</p>
        </div>

        <div className="card" onClick={() => navigate("/health")}>
          <div className="big-emoji">💚</div>
          <h3>Health Chart</h3>
          <p>Review vitals and graphs.</p>
        </div>

        <div className="card" onClick={() => navigate("/voice")}>
          <div className="big-emoji">🎤</div>
          <h3>Voice Assistant</h3>
          <p>Talk to your digital companion.</p>
        </div>
      </div>
    </div>
  );
}
