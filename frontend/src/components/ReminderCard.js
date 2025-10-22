import React from 'react';
import { BellAlertIcon, CalendarDaysIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ReminderCard = ({ reminder, onToggleComplete }) => {
  const Icon = reminder.type === 'Appointment' ? CalendarDaysIcon : BellAlertIcon;
  const borderClass = reminder.type === 'Appointment' ? 'border-indigo-500' : 'border-yellow-500';
  const isCompleted = !!reminder.isCompleted;

  return (
    <div className={`p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 border-l-4 ${borderClass} transition`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-3 mb-1">
            <Icon className="h-6 w-6 text-indigo-500" />
            <h3 className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-400' : ''}`}>{reminder.title}</h3>
          </div>
          <p className="text-sm text-gray-500 ml-9">{reminder.time} • {reminder.type}</p>
        </div>

        <button
          onClick={() => onToggleComplete(reminder.id)}
          className={`p-2 rounded-full ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700'}`}
          aria-label="toggle-complete"
        >
          {isCompleted ? <CheckCircleIcon className="h-6 w-6" /> : <XMarkIcon className="h-6 w-6" />}
        </button>
      </div>

      {isCompleted && <span className="inline-block mt-3 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">COMPLETED</span>}
    </div>
  );
};

export default ReminderCard;
