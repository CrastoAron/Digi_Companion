// src/pages/Health.js
import React from "react";
import HealthChart from "../components/HealthChart";

export default function Health() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Health Tracking</h2>
      <HealthChart />
    </div>
  );
}
