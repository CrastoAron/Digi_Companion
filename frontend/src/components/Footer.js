import React from 'react';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full mt-auto py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">Lifespan</h3>
            <p className="text-sm text-gray-500">Your digital companion for elder care.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-2">App Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-600">Dashboard</Link></li>
              <li><Link to="/reminders" className="hover:text-indigo-600">Reminders</Link></li>
              <li><Link to="/health" className="hover:text-indigo-600">Health</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-2">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-2">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center"><EnvelopeIcon className="h-4 w-4 mr-2" /> support@lifespan.app</li>
              <li className="flex items-center"><PhoneIcon className="h-4 w-4 mr-2" /> +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500">&copy; {currentYear} Lifespan Digital Companion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
