import React from 'react';
import {
  BellAlertIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const ReminderCard = ({ reminder, onToggleComplete, onEdit, onDelete }) => {
  const Icon = reminder.type === 'Appointment' ? CalendarDaysIcon : BellAlertIcon;
  const isCompleted = !!reminder.isCompleted;

  return (
    <div
      className={`
        p-5 rounded-2xl shadow-md 
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        hover:shadow-xl hover:-translate-y-1 
        transition-all duration-300
      `}
    >
      <div className="flex justify-between items-start">

        {/* Left section */}
        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className={`
                p-2 rounded-xl shadow-sm 
                ${reminder.type === "Appointment" 
                  ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white"
                  : "bg-yellow-100 dark:bg-yellow-600 text-yellow-700 dark:text-white"
                }
              `}
            >
              <Icon className="h-6 w-6" />
            </div>

            <h3
              className={`
                text-lg font-semibold 
                ${isCompleted ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}
              `}
            >
              {reminder.title}
            </h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 ml-2 mt-1">
            ⏱ {reminder.time} &nbsp; • &nbsp; {reminder.type}
          </p>
        </div>

        {/* Toggle Complete Button */}
        <button
          onClick={() => onToggleComplete && onToggleComplete(reminder._id)}
          className={`
            p-3 rounded-full shadow-sm
            transition-all duration-300 
            ${isCompleted 
              ? "bg-green-500 text-white hover:bg-green-600" 
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }
          `}
          aria-label="toggle-complete"
        >
          {isCompleted ? (
            <CheckCircleIcon className="h-6 w-6" />
          ) : (
            <XMarkIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-5 ml-2">
        <button
          onClick={() => onEdit && onEdit(reminder)}
          className="
            px-4 py-2 bg-yellow-400 hover:bg-yellow-500
            rounded-lg text-sm font-medium text-gray-900
            shadow-sm transition-all flex items-center gap-1
          "
        >
          <PencilSquareIcon className="h-4 w-4" /> Edit
        </button>

        <button
          onClick={() => onDelete && onDelete(reminder._id)}
          className="
            px-4 py-2 bg-red-500 hover:bg-red-600
            rounded-lg text-sm font-medium text-white
            shadow-sm transition-all flex items-center gap-1
          "
        >
          <TrashIcon className="h-4 w-4" /> Delete
        </button>
      </div>

      {/* Completed Badge */}
      {isCompleted && (
        <span
          className="
            inline-block mt-4 ml-2
            px-3 py-1 text-xs font-bold 
            bg-green-500 text-white rounded-full 
          "
        >
          COMPLETED
        </span>
      )}
    </div>
  );
};

export default ReminderCard;
