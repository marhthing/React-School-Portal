import React from 'react';
import SubjectCategoryBadge from './SubjectCategoryBadge';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

export default function SubjectsTable({
  subjects,
  classes,
  teachers,
  onEdit,
  onDelete,
  onAssignTeachers,
}) {
  // Helper to get teacher names from IDs
  function getTeacherNames(teacherIds) {
    return teacherIds
      .map((id) => teachers.find((t) => t.id === id))
      .filter(Boolean)
      .map((t) => t.name)
      .join(', ');
  }

  return (
    <>
      {/* Desktop/Tablet Table */}
      <div className="overflow-x-auto border rounded hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Subject Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Abbreviation</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Assigned Classes</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Assigned Teachers</th>
              <th className="px-4 py-2 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No subjects found.
                </td>
              </tr>
            ) : (
              subjects.map((subj) => (
                <tr key={subj.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-4 py-2 whitespace-nowrap">{subj.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{subj.abbreviation}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <SubjectCategoryBadge category={subj.category} />
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {subj.assignedClasses.join(', ')}
                  </td>
                  <td
                    className="px-4 py-2 whitespace-nowrap"
                    title={getTeacherNames(subj.assignedTeachers)}
                  >
                    {subj.assignedTeachers.length}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => onEdit(subj)}
                      title="Edit Subject"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(subj)}
                      title="Delete Subject"
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => onAssignTeachers(subj)}
                      title="Assign Teachers"
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaUserPlus />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {subjects.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No subjects found.</div>
        ) : (
          subjects.map((subj) => (
            <div
              key={subj.id}
              className="border rounded p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{subj.name}</h2>
                <div className="space-x-2 text-sm flex-shrink-0">
                  <button
                    onClick={() => onEdit(subj)}
                    title="Edit Subject"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(subj)}
                    title="Delete Subject"
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => onAssignTeachers(subj)}
                    title="Assign Teachers"
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaUserPlus />
                  </button>
                </div>
              </div>
              <p>
                <span className="font-semibold">Abbreviation:</span> {subj.abbreviation}
              </p>
              <p className="my-1 flex items-center">
                <span className="font-semibold mr-2">Category:</span>
                <SubjectCategoryBadge category={subj.category} />
              </p>
              <p>
                <span className="font-semibold">Assigned Classes:</span> {subj.assignedClasses.join(', ')}
              </p>
              <p title={getTeacherNames(subj.assignedTeachers)}>
                <span className="font-semibold">Assigned Teachers:</span> {subj.assignedTeachers.length}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
