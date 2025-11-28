// src/components/HealthChart.js
import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function HealthChart() {
  const [data, setData] = useState([]);
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editHeartRate, setEditHeartRate] = useState("");
  const [editBloodPressure, setEditBloodPressure] = useState("");

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/health");
        const formatted = res.data.map((item) => {
          const date = new Date(item.timestamp);
          return {
            _id: item._id,
            HeartRate: item.heartRate,
            BloodPressure: item.bloodPressure,
            label: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            fullLabel: date.toLocaleString(),
          };
        });
        setData(formatted);
      } catch (err) {
        console.error("Health fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add entry
  const addEntry = async () => {
    if (!heartRate || !bloodPressure) return alert("Enter both values");

    try {
      const res = await API.post("/health", {
        heartRate: Number(heartRate),
        bloodPressure: Number(bloodPressure),
      });

      const item = res.data;
      const date = new Date(item.timestamp);

      setData((prev) => [
        ...prev,
        {
          _id: item._id,
          HeartRate: item.heartRate,
          BloodPressure: item.bloodPressure,
          label: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          fullLabel: date.toLocaleString(),
        },
      ]);

      setHeartRate("");
      setBloodPressure("");
    } catch (err) {
      alert("Failed to add entry");
    }
  };

  // Update entry
  const updateEntry = async (id) => {
    try {
      const res = await API.patch(`/health/${id}`, {
        heartRate: Number(editHeartRate),
        bloodPressure: Number(editBloodPressure),
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                HeartRate: res.data.heartRate,
                BloodPressure: res.data.bloodPressure,
              }
            : item
        )
      );

      setEditingId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  // Delete entry
  const deleteEntry = async (id) => {
    try {
      await API.delete(`/health/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading health data...
      </div>
    );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

      {/* HEADER */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Vitals Overview
      </h3>

      {/* METRIC CARDS */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-green-100 dark:bg-green-900 text-center rounded-xl shadow">
            <p className="text-sm opacity-70">Avg HR</p>
            <p className="text-2xl font-bold">
              {Math.round(data.reduce((a, b) => a + b.HeartRate, 0) / data.length)}
            </p>
          </div>

          <div className="p-4 bg-indigo-100 dark:bg-indigo-900 text-center rounded-xl shadow">
            <p className="text-sm opacity-70">Avg BP</p>
            <p className="text-2xl font-bold">
              {Math.round(
                data.reduce((a, b) => a + b.BloodPressure, 0) / data.length
              )}
            </p>
          </div>

          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 text-center rounded-xl shadow">
            <p className="text-sm opacity-70">Max HR</p>
            <p className="text-xl font-bold">
              {Math.max(...data.map((e) => e.HeartRate))}
            </p>
          </div>

          <div className="p-4 bg-red-100 dark:bg-red-900 text-center rounded-xl shadow">
            <p className="text-sm opacity-70">Max BP</p>
            <p className="text-xl font-bold">
              {Math.max(...data.map((e) => e.BloodPressure))}
            </p>
          </div>
        </div>
      )}

      {/* ALERT BOX */}
      {data.some((e) => e.HeartRate > 110 || e.BloodPressure > 140) && (
        <div className="mb-8 p-4 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded-xl shadow text-sm">
          ⚠️ Some readings are higher than normal — please monitor closely.
        </div>
      )}

      {/* INPUT SECTION */}
      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="number"
          placeholder="Heart Rate"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="p-3 border rounded-lg w-32 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="number"
          placeholder="Blood Pressure"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          className="p-3 border rounded-lg w-40 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={addEntry}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* CHART */}
      <div className="w-full h-80 mb-10 bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip labelFormatter={(v, p) => p[0]?.payload.fullLabel} />
            <Legend />
            <Line
              type="monotone"
              dataKey="HeartRate"
              stroke="#ef4444"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="BloodPressure"
              stroke="#4f46e5"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* HISTORY LIST */}
      <div className="space-y-3">
        {data.map((entry) => (
          <div
            key={entry._id}
            className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm"
          >
            {editingId === entry._id ? (
              <>
                <input
                  type="number"
                  value={editHeartRate}
                  onChange={(e) => setEditHeartRate(e.target.value)}
                  className="p-2 w-24 rounded bg-gray-50 dark:bg-gray-600"
                />
                <input
                  type="number"
                  value={editBloodPressure}
                  onChange={(e) => setEditBloodPressure(e.target.value)}
                  className="p-2 w-28 rounded bg-gray-50 dark:bg-gray-600"
                />
                <button
                  onClick={() => updateEntry(entry._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-xs"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-sm">
                  <strong>{entry.fullLabel}</strong> — HR:{" "}
                  {entry.HeartRate}, BP: {entry.BloodPressure}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(entry._id);
                      setEditHeartRate(entry.HeartRate);
                      setEditBloodPressure(entry.BloodPressure);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEntry(entry._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
