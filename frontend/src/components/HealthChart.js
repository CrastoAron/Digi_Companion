import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HealthChart = ({ title = "Vitals Trend" }) => {
  const [data, setData] = useState([]);
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [view, setView] = useState('daily');

  const [editingIndex, setEditingIndex] = useState(null);
  const [editHeartRate, setEditHeartRate] = useState('');
  const [editBloodPressure, setEditBloodPressure] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsIndex, setDetailsIndex] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('healthData')) || [];
    storedData.sort((a, b) => a.timestamp - b.timestamp);
    setData(storedData);
  }, []);

  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(data));
  }, [data]);

  // Add new entry
  const handleAddData = () => {
    if (!heartRate || !bloodPressure) return;

    const now = new Date();
    const dateLabel = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry = {
      name: dateLabel,
      fullLabel: `${dateLabel} ${timeLabel}`,
      HeartRate: parseInt(heartRate),
      BloodPressure: parseInt(bloodPressure),
      timestamp: now.getTime(),
    };

    setData(prev => [...prev, newEntry].sort((a, b) => a.timestamp - b.timestamp));
    setHeartRate('');
    setBloodPressure('');
  };

  // Edit handling
  const startEdit = (index) => {
    setEditingIndex(index);
    setEditHeartRate(data[index].HeartRate);
    setEditBloodPressure(data[index].BloodPressure);
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updatedData = [...data];
    updatedData[editingIndex] = {
      ...updatedData[editingIndex],
      HeartRate: parseInt(editHeartRate),
      BloodPressure: parseInt(editBloodPressure),
    };
    setData(updatedData);
    setEditingIndex(null);
    setShowEditModal(false);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setShowEditModal(false);
  };

  // Delete handling
  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (deleteIndex !== null) {
      setData(prev => prev.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setDeleteIndex(null);
    setShowDeleteModal(false);
  };

  // View Details
  const viewDetails = (index) => {
    setDetailsIndex(index);
    setShowDetailsModal(true);
  };

  const closeDetails = () => {
    setDetailsIndex(null);
    setShowDetailsModal(false);
  };

  // Chart data aggregation
  const getChartData = () => {
    if (view === 'daily') return data;

    const grouped = {};
    data.forEach(entry => {
      const date = new Date(entry.timestamp);
      let key, shortLabel;

      if (view === 'weekly') {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDays = (date - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
        key = `Week ${weekNumber} ${date.getFullYear()}`;
        shortLabel = `W${weekNumber}`;
      } else if (view === 'monthly') {
        key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        shortLabel = date.toLocaleString('default', { month: 'short' });
      }

      if (!grouped[key]) grouped[key] = { HeartRate: [], BloodPressure: [], shortLabel, fullLabel: key };
      grouped[key].HeartRate.push(entry.HeartRate);
      grouped[key].BloodPressure.push(entry.BloodPressure);
    });

    return Object.values(grouped).map(g => ({
      name: g.shortLabel,
      fullLabel: g.fullLabel,
      HeartRate: Math.round(g.HeartRate.reduce((a, b) => a + b, 0) / g.HeartRate.length),
      BloodPressure: Math.round(g.BloodPressure.reduce((a, b) => a + b, 0) / g.BloodPressure.length),
    }));
  };

  const chartData = getChartData();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      {/* Input form */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Heart Rate"
          value={heartRate}
          onChange={e => setHeartRate(e.target.value)}
          className="p-2 border rounded w-32"
        />
        <input
          type="number"
          placeholder="Blood Pressure"
          value={bloodPressure}
          onChange={e => setBloodPressure(e.target.value)}
          className="p-2 border rounded w-32"
        />
        <button onClick={handleAddData} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
        <select
          value={view}
          onChange={e => setView(e.target.value)}
          className="p-2 border rounded ml-2"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [value, name]}
              labelFormatter={(label, payload) => payload && payload.length ? payload[0].payload.fullLabel : label}
            />
            <Legend />
            <Line type="monotone" dataKey="HeartRate" stroke="#ef4444" strokeWidth={2} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="BloodPressure" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Last updated */}
      <div className="text-xs text-gray-500 mb-4">
        Last updated: {data.length ? data[data.length - 1].fullLabel : 'No data yet'}
      </div>

      {/* Data List */}
      <div className="space-y-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded cursor-pointer"
               onClick={() => viewDetails(index)}>
            <div className="flex-1">
              {entry.fullLabel} — HR: {entry.HeartRate}, BP: {entry.BloodPressure}
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); startEdit(index); }} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={(e) => { e.stopPropagation(); confirmDelete(index); }} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
            <p className="mb-4">
              Are you sure you want to delete <strong>{data[deleteIndex]?.fullLabel}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h4 className="text-lg font-semibold mb-4">Edit Entry</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={editHeartRate}
                onChange={e => setEditHeartRate(e.target.value)}
                className="p-2 border rounded w-32"
                placeholder="Heart Rate"
              />
              <input
                type="number"
                value={editBloodPressure}
                onChange={e => setEditBloodPressure(e.target.value)}
                className="p-2 border rounded w-32"
                placeholder="Blood Pressure"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={cancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal with Mini Chart and Trend */}
      {showDetailsModal && detailsIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Entry Details</h4>

            <p><strong>Date & Time:</strong> {data[detailsIndex].fullLabel}</p>
            <p>
              <strong>Heart Rate:</strong> {data[detailsIndex].HeartRate}{" "}
              {detailsIndex > 0 && (
                <span className={data[detailsIndex].HeartRate > data[detailsIndex - 1].HeartRate ? 'text-red-500' : 'text-green-500'}>
                  ({data[detailsIndex].HeartRate > data[detailsIndex - 1].HeartRate ? '↑' : '↓'} compared to previous)
                </span>
              )}
            </p>
            <p>
              <strong>Blood Pressure:</strong> {data[detailsIndex].BloodPressure}{" "}
              {detailsIndex > 0 && (
                <span className={data[detailsIndex].BloodPressure > data[detailsIndex - 1].BloodPressure ? 'text-red-500' : 'text-green-500'}>
                  ({data[detailsIndex].BloodPressure > data[detailsIndex - 1].BloodPressure ? '↑' : '↓'} compared to previous)
                </span>
              )}
            </p>

            {/* Mini trend chart (last 7 entries) */}
            <div className="w-full h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.slice(Math.max(0, detailsIndex - 6), detailsIndex + 1)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label, payload) => payload && payload.length ? payload[0].payload.fullLabel : label}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="HeartRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={(props) => props.index === Math.min(6, detailsIndex) ? <circle {...props} r={8} fill="#ef4444" /> : <circle {...props} r={3} fill="#ef4444" />}
                  />
                  <Line
                    type="monotone"
                    dataKey="BloodPressure"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={(props) => props.index === Math.min(6, detailsIndex) ? <circle {...props} r={8} fill="#4f46e5" /> : <circle {...props} r={3} fill="#4f46e5" />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={closeDetails} className="px-4 py-2 bg-blue-500 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthChart;
