import React from 'react';

export default function ClassReport({ filters, onFilterChange, data, classOptions, termOptions, sessionOptions }) {
  // Handle select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Class Select */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="class">Class</label>
          <select
            id="class"
            name="class"
            value={filters.class}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Term Select */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="term">Term</label>
          <select
            id="term"
            name="term"
            value={filters.term}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="">Select Term</option>
            {termOptions.map((term) => (
              <option key={term} value={term}>{term}</option>
            ))}
          </select>
        </div>

        {/* Session Select */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="session">Session</label>
          <select
            id="session"
            name="session"
            value={filters.session}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="">Select Session</option>
            {sessionOptions.map((session) => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Data */}
      <div>
        {!data && <p>No data available for the selected filters.</p>}

        {data && data.length === 0 && <p>No records found.</p>}

        {data && data.length > 0 && (
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr>
                {/* Adjust these headers based on your actual data structure */}
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Student Name</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Average Score</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{record.studentName}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{record.averageScore}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">{record.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
