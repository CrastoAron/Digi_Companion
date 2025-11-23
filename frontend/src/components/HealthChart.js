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

  // ✅ load data
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

  // ✅ add entry
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

  // ✅ update entry
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

  // ✅ delete entry
  const deleteEntry = async (id) => {
    try {
      await API.delete(`/health/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div>Loading health data...</div>;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">

      <h3 className="text-lg font-semibold mb-4">Vitals Overview</h3>

      {/* ✅ Analytics */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
          <div className="p-3 bg-green-100 dark:bg-green-800 rounded">
            Avg HR:
            <div className="font-bold">
              {Math.round(data.reduce((a, b) => a + b.HeartRate, 0) / data.length)}
            </div>
          </div>

          <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded">
            Avg BP:
            <div className="font-bold">
              {Math.round(data.reduce((a, b) => a + b.BloodPressure, 0) / data.length)}
            </div>
          </div>

          <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded">
            Max HR:
            <div className="font-bold">
              {Math.max(...data.map((e) => e.HeartRate))}
            </div>
          </div>

          <div className="p-3 bg-red-100 dark:bg-red-800 rounded">
            Max BP:
            <div className="font-bold">
              {Math.max(...data.map((e) => e.BloodPressure))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ Alerts */}
      {data.some((e) => e.HeartRate > 110 || e.BloodPressure > 140) && (
        <div className="p-3 mb-6 bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 rounded text-sm">
          ⚠️ Health Alert: Some readings are higher than normal — consider monitoring!
        </div>
      )}

      {/* ✅ Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          placeholder="Heart Rate"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="p-2 border rounded w-32"
        />
        <input
          type="number"
          placeholder="Blood Pressure"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          className="p-2 border rounded w-40"
        />
        <button onClick={addEntry} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* ✅ Chart */}
      <div className="w-full h-72 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip labelFormatter={(v, p) => p[0]?.payload.fullLabel} />
            <Legend />
            <Line type="monotone" dataKey="HeartRate" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="BloodPressure" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Editable List */}
      <div className="space-y-2">
        {data.map((entry) => (
          <div key={entry._id} className="flex justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">

            {editingId === entry._id ? (
              <>
                <input
                  type="number"
                  value={editHeartRate}
                  onChange={(e) => setEditHeartRate(e.target.value)}
                  className="p-1 w-20 rounded"
                />
                <input
                  type="number"
                  value={editBloodPressure}
                  onChange={(e) => setEditBloodPressure(e.target.value)}
                  className="p-1 w-24 rounded"
                />
                <button onClick={() => updateEntry(entry._id)} className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  Save
                </button>
                <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>
                  {entry.fullLabel} — HR: {entry.HeartRate}, BP: {entry.BloodPressure}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(entry._id);
                      setEditHeartRate(entry.HeartRate);
                      setEditBloodPressure(entry.BloodPressure);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEntry(entry._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
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
