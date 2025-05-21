// src/components/SubjectSummary.jsx
import React, { useState } from 'react';

const classes = ['JSS1', 'JSS2', 'SSS1', 'SSS2A', 'SSS2B'];

const SubjectSummary = () => {
  const [selectedClass, setSelectedClass] = useState('');

  // TODO: replace this with actual chart later
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Subject Summary per Class</h3>
        <select
          className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center items-center flex-grow text-gray-500 dark:text-gray-400">
        {/* Placeholder for chart */}
        {selectedClass ? (
          <p>Bar Chart for {selectedClass} will render here</p>
        ) : (
          <p>Select a class to view subject summary</p>
        )}
      </div>
    </div>
  );
};

export default SubjectSummary;
