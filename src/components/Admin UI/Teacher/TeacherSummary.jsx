import React from "react";

const TeacherSummary = ({ totalTeachers }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">
        Teacher Summary
      </h3>
      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
        {totalTeachers}
      </p>
      <p className="text-gray-500 dark:text-gray-400">Total Teachers</p>
    </div>
  );
};

export default TeacherSummary;
