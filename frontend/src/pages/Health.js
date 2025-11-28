// src/pages/Health.js
import React from "react";
import HealthChart from "../components/HealthChart";

export default function Health() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 transition-all duration-300">
      <div className="max-w-5xl mx-auto">

        {/* =========================== */}
        {/* 🌟 Page Header */}
        {/* =========================== */}
        <div
          className="mb-10 p-10 rounded-3xl shadow-xl 
                     bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white transform transition-all"
        >
          <h2 className="text-4xl font-extrabold mb-2 drop-shadow-md">
            🩺 Health Tracking
          </h2>
          <p className="text-lg opacity-90 font-light">
            Monitor your vitals and keep track of your health trends.
          </p>
        </div>

        {/* =========================== */}
        {/* 🌟 Chart Card */}
        {/* =========================== */}
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl 
                     p-8 border border-gray-200 dark:border-gray-700
                     backdrop-blur-md transition-all duration-300"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            📊 Recent Vitals Overview
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
            This chart shows your health data trends such as heart rate, blood pressure,  
            glucose levels, and other key metrics captured over time.
          </p>

          {/* Chart Container */}
          <div
            className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-700
                       shadow-inner border border-gray-300 dark:border-gray-600"
          >
            <HealthChart />
          </div>
        </div>
      </div>
    </div>
  );
}
