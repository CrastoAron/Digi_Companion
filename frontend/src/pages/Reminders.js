import React, { useState } from 'react';
import { BellAlertIcon, PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import ReminderCard from '../components/ReminderCard';

const initialReminders = [
  { id: 1, title: 'Take Morning Pill', time: '8:00 AM', type: 'Medication', isCompleted: false },
  { id: 2, title: 'Call Doctor Jones', time: '10:30 AM', type: 'Appointment', isCompleted: false },
  { id: 3, title: 'Check Blood Pressure', time: '5:00 PM', type: 'Medication', isCompleted: true },
];

const Reminders = () => {
  const [reminders, setReminders] = useState(initialReminders);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Medication');

  const handleToggleComplete = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newReminder = {
      id: Date.now(),
      title: newTitle.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: newType,
      isCompleted: false,
    };
    setReminders(prev => [newReminder, ...prev]);
    setNewTitle('');
  };

  const pending = reminders.filter(r => !r.isCompleted);
  const completed = reminders.filter(r => r.isCompleted);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center"><BellAlertIcon className="h-6 w-6 mr-2 text-yellow-500" /> All Reminders</h1>

      <div className="p-6 mb-6 bg-indigo-50 dark:bg-gray-700 rounded-xl border-l-4 border-indigo-500">
        <h2 className="font-bold mb-3 flex items-center"><PlusIcon className="h-5 w-5 mr-2" /> Quick Add</h2>
        <form onSubmit={handleAddReminder} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <select value={newType} onChange={e => setNewType(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
              <option>Medication</option>
              <option>Appointment</option>
              <option>Other</option>
            </select>
          </div>
          <button className="py-2 px-4 bg-indigo-600 text-white rounded-lg">Add Reminder</button>
        </form>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending ({pending.length})</h2>
        <div className="space-y-4">
          {pending.length ? pending.map(r => <ReminderCard key={r.id} reminder={r} onToggleComplete={handleToggleComplete} />)
            : <p className="text-gray-500">All caught up!</p>}
        </div>
      </section>

      {completed.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Completed ({completed.length})</h2>
          <div className="space-y-4 opacity-80">
            {completed.map(r => <ReminderCard key={r.id} reminder={r} onToggleComplete={handleToggleComplete} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Reminders;
