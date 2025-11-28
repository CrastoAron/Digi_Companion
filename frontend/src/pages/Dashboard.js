// src/pages/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const cards = [
    {
      emoji: "⏰",
      title: "Reminders",
      desc: "Set medication and appointment alerts.",
      route: "/reminders",
      color: "from-yellow-400/10 to-orange-500/10",
    },
    {
      emoji: "💚",
      title: "Health Chart",
      desc: "Review vitals and health statistics.",
      route: "/health",
      color: "from-green-400/10 to-emerald-500/10",
    },
    {
      emoji: "🎤",
      title: "Voice Assistant",
      desc: "Talk to your digital companion.",
      route: "/voice",
      color: "from-pink-400/10 to-fuchsia-500/10",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900">

      {/* Welcome Banner */}
      <section
        className="rounded-3xl p-10 mb-10 shadow-xl
                   bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
      >
        <h1 className="text-4xl font-extrabold">
          Welcome{user ? `, ${user.name || user.email}` : ""} 👋
        </h1>
        <p className="text-lg font-light mt-3 opacity-90">
          Manage your reminders, track your health, and interact with your digital companion.
        </p>
      </section>

      {/* Feature Grid */}
      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => navigate(card.route)}
            className={`
              p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800
              hover:shadow-2xl hover:-translate-y-1 transition
              border border-transparent hover:border-indigo-500/20
              text-left bg-gradient-to-br ${card.color}
            `}
          >
            <div className="text-6xl mb-4">{card.emoji}</div>
            <h3 className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">{card.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{card.desc}</p>
          </button>
        ))}
      </section>

    </main>
  );
}
