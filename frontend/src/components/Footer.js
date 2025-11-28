// src/components/Footer.js
import React from "react";
import { EnvelopeIcon, PhoneIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HeartIcon className="h-6 w-6 text-red-500" />
              <h3 className="text-xl font-bold text-indigo-600">Lifespan</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Your caring digital companion designed to assist elders with comfort and ease.
            </p>
          </div>

          {/* APP LINKS */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
              App Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-600">Dashboard</Link></li>
              <li><Link to="/reminders" className="hover:text-indigo-600">Reminders</Link></li>
              <li><Link to="/health" className="hover:text-indigo-600">Health</Link></li>
              <li><Link to="/voice" className="hover:text-indigo-600">Voice Assistant</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase mb-3">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-indigo-500" />
                support@lifespan.app
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-indigo-500" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {year} Lifespan — All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
