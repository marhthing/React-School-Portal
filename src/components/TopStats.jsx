// src/components/TopStats.jsx
import React from 'react';

const stats = [
  { label: 'Total Students', value: 320, color: 'bg-blue-500' },
  { label: 'Total Teachers', value: 25, color: 'bg-green-500' },
  { label: 'Total Classes', value: 12, color: 'bg-yellow-500' },
  { label: 'Current Term', value: '2nd Term', color: 'bg-red-500' },
  { label: 'Current Session', value: '2024/2025', color: 'bg-purple-500' },
];

const TopStats = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
      {stats.map(({ label, value, color }) => (
        <div key={label} className={`${color} rounded shadow p-4 text-white flex flex-col items-center`}>
          <h6 className="font-semibold">{label}</h6>
          <p className="text-2xl mt-2">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default TopStats;
