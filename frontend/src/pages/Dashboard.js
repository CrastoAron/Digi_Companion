import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import ReminderCard from '../components/ReminderCard';
import HealthChart from '../components/HealthChart';
import VoiceAssistant from '../components/VoiceAssistant';

const mockReminders = [
  { id: 1, title: 'Take Vitamin D', time: '8:00 AM', type: 'Medication', isCompleted: false },
  { id: 2, title: 'Check Blood Sugar', time: '6:00 PM', type: 'Medication', isCompleted: false },
];

const Dashboard = () => {
  const handleToggleComplete = (id) => {
    console.log('toggle reminder', id);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="p-8 mb-8 bg-indigo-500 dark:bg-indigo-900 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-extrabold">Welcome Back, User!</h1>
        <p className="mt-2 text-indigo-100">Here's a summary of your day.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <HealthChart />
          </section>

          <section>
            <VoiceAssistant />
          </section>
        </div>

        <aside className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Today's Reminders</h2>
            <div className="space-y-4">
              {mockReminders.map(r => (
                <ReminderCard key={r.id} reminder={r} onToggleComplete={handleToggleComplete} />
              ))}
            </div>
            <div className="mt-4 text-right">
              <a href="/reminders" className="text-indigo-600 hover:underline flex items-center justify-end">
                Manage all <ArrowRightIcon className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500">
            <h3 className="font-bold text-green-700 dark:text-green-300">Need help?</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Use the assistant or contact support.</p>
            <button className="mt-3 w-full py-2 bg-green-600 text-white rounded-lg">Contact Support</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
