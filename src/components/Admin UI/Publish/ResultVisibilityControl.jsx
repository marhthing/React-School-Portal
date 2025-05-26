import React, { useState } from 'react';

const ResultVisibilityControl = ({
  classes = [],
  students = [], // Default to empty array
  visibilitySettings = { classes: [], students: [] },
  onToggleClassVisibility,
  onToggleStudentVisibility,
  onSaveVisibility,
  saving,
  message,
}) => {
  const [studentSearch, setStudentSearch] = useState('');

  // Defensive check: ensure students is an array before filtering
  const safeStudents = Array.isArray(students) ? students : [];

  const filteredStudents = safeStudents.filter((student) =>
    student.fullName?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Result Visibility Control</h2>

      {/* Class Visibility Toggles */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Classes</h3>
        <div className="flex flex-wrap gap-4">
          {classes.map((cls) => {
            const classId = cls.id || cls;
            const enabled = (visibilitySettings.classes || []).includes(classId);
            return (
              <label key={classId} className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => onToggleClassVisibility(classId)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200">{cls.name || cls}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Individual Student Visibility */}
      <div>
        <h3 className="font-semibold mb-2">Individual Students</h3>

        {/* Search box */}
        <input
          type="text"
          placeholder="Search students by name"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        />

        <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
          {filteredStudents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No students found.</p>
          ) : (
            filteredStudents.map((student) => {
              const enabled = (visibilitySettings.students || []).includes(student.regNumber);
              return (
                <label
                  key={student.regNumber}
                  className="flex items-center justify-between mb-2 cursor-pointer"
                >
                  <span className="text-gray-800 dark:text-gray-200">
                    {student.fullName} ({student.className})
                  </span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => onToggleStudentVisibility(student.regNumber)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSaveVisibility}
        disabled={saving}
        className={`mt-6 w-full py-2 px-4 rounded text-white font-semibold ${
          saving ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {saving ? 'Saving...' : 'Save Visibility Settings'}
      </button>

      {/* Feedback Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
    </section>
  );
};

export default ResultVisibilityControl;
