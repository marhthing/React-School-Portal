// src/components/PassFailChart.jsx
import React from 'react';

const PassFailChart = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 my-6">
      <h3 className="text-lg font-semibold mb-4">Class-Wise Pass vs Fail</h3>
      <div className="h-64 flex justify-center items-center text-gray-500 dark:text-gray-400">
        {/* Replace with Chart.js bar chart later */}
        <p>Bar chart of pass vs fail across classes will go here</p>
      </div>
    </div>
  );
};

export default PassFailChart;
