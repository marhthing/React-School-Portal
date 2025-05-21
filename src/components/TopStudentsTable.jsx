// src/components/TopStudentsTable.jsx
import React from 'react';

const mockTopStudents = [
  { class: 'JSS1', students: ['Samuel A.', 'Chidi B.', 'Ada E.'] },
  { class: 'JSS2', students: ['Tolu A.', 'Grace M.', 'Peter S.'] },
  { class: 'SSS1', students: ['Rita O.', 'Michael U.', 'Faith Z.'] },
  { class: 'SSS2A', students: ['Jane K.', 'Obi L.', 'Daniel Z.'] },
];

const TopStudentsTable = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-10">
      <h3 className="text-lg font-semibold mb-4">Top 3 Students per Class</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-left">
            <th className="p-2">Class</th>
            <th className="p-2">Top 3 Students</th>
          </tr>
        </thead>
        <tbody>
          {mockTopStudents.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-300 dark:border-gray-600">
              <td className="p-2">{item.class}</td>
              <td className="p-2">{item.students.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopStudentsTable;
