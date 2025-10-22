import React from 'react';
import HealthChart from '../components/HealthChart';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Health = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold mb-6">Health & Wellness Tracker</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Heart Rate</h3>
          <p className="text-2xl font-bold mt-2">72 bpm</p>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-sm font-medium text-gray-500">Calories</h3>
          <p className="text-2xl font-bold mt-2">580 kcal</p>
        </div>
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-sm font-medium text-gray-500">Sleep</h3>
          <p className="text-2xl font-bold mt-2">7.5 hrs</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Vitals History</h2>
          <button className="flex items-center text-indigo-600"><PlusIcon className="h-5 w-5 mr-1" /> Add</button>
        </div>
        <HealthChart title="Weekly Heart Rate & Blood Pressure" />
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center"><DocumentTextIcon className="h-5 w-5 mr-2" /> Recent Data Logs</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4">Oct 15, 2025 at 08:00 AM</td>
                <td className="px-6 py-4">Blood Pressure</td>
                <td className="px-6 py-4">120/80</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-green-100 text-green-800">Optimal</span></td>
              </tr>
              <tr>
                <td className="px-6 py-4">Oct 16, 2025 at 07:30 AM</td>
                <td className="px-6 py-4">Steps</td>
                <td className="px-6 py-4">12,050</td>
                <td className="px-6 py-4"><span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">Excellent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Health;
