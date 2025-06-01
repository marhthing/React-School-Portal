import React from "react";
import Spinner from '../../ui/Spinner'

export default function StudentList({
  students,
  selectedClass,
  selectedStudents,
  onToggleStudent,
  onSelectStudent, // for row click highlight (optional)
  selectedStudent, // for row highlight
  onViewSubjects, // NEW: callback to open modal with subjects for a student
  loading,
}) {
  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400"><Spinner /></p>
    );
  }

  if (!selectedClass) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        Please select a class to see students.
      </p>
    );
  }

  if (!students.length) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        No students found for {selectedClass.name}.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {[
              "Select",
              "Reg. No",
              "Name",
              "Gender",
              "Registered",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {students.map((student) => {
            const isSelected = selectedStudents.has(student.id);
            const isRowSelected = selectedStudent?.id === student.id;

            const baseRowClass = "cursor-pointer transition-colors duration-150";
const rowClasses = baseRowClass;

return (
  <tr
    key={student.reg_no}
    className={rowClasses}
    onClick={() => onSelectStudent && onSelectStudent(student)}
  >
    <td className="px-4 py-2 whitespace-nowrap text-center">
      <input
        type="checkbox"
        checked={student.registered ? true : isSelected}
        disabled={student.registered}
        onChange={(e) => {
          if (student.registered) return;
          e.stopPropagation(); // prevent row click triggering
          onToggleStudent(student.id);
        }}
        className={`h-4 w-4 border-gray-300 rounded focus:ring-indigo-500 ${
          student.registered ? "text-green-600 cursor-not-allowed" : "text-indigo-600"
        }`}
      />
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
      {student.reg_no}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
      {student.name}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
      {student.gender}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm">
      {student.registered ? (
        <span className="text-green-600 dark:text-green-400 font-semibold">Yes</span>
      ) : (
        <span className="text-red-600 dark:text-red-400 font-semibold">No</span>
      )}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm">
      <button
        type="button"
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        onClick={(e) => {
          e.stopPropagation(); // prevent row click
          if (onViewSubjects) onViewSubjects(student);
        }}
      >
        View
      </button>
    </td>
  </tr>
);


          })}
        </tbody>
      </table>
    </div>
  );
}
