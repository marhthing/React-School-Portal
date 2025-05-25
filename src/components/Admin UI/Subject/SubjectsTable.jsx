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
function getClassNames(classIds = []) {
  return classIds
    .map((id) => classes.find((c) => Number(c.id) === Number(id)))
    .filter(Boolean)
    .map((c) => c.name)
    .join(', ');
}

function getTeacherNames(teacherIds = []) {
  return teacherIds
    .map((id) => teachers.find((t) => Number(t.id) === Number(id)))
    .filter(Boolean)
    .map((t) => t.name)
    .join(', ');
}


  return (
    <>
      {/* Desktop Table */}
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
                  <td className="px-4 py-2">{subj.name}</td>
                  <td className="px-4 py-2">{subj.abbreviation}</td>
                  <td className="px-4 py-2">
                    <SubjectCategoryBadge category={subj.category} />
                  </td>
                  <td className="px-4 py-2">
                    {getClassNames(subj.assignedClasses)}
                  </td>
                  <td className="px-4 py-2" title={getTeacherNames(subj.assignedTeachers)}>
                    {subj.assignedTeachers?.length || 0}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => onEdit(subj)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(subj)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => onAssignTeachers(subj)}
                      className="text-green-600 hover:text-green-800"
                      title="Assign Teachers"
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
            <div key={subj.id} className="border rounded p-4 shadow-sm bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{subj.name}</h2>
                <div className="space-x-2">
                  <button
                    onClick={() => onEdit(subj)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(subj)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => onAssignTeachers(subj)}
                    className="text-green-600 hover:text-green-800"
                    title="Assign Teachers"
                  >
                    <FaUserPlus />
                  </button>
                </div>
              </div>
              <p><strong>Abbreviation:</strong> {subj.abbreviation}</p>
              <p className="flex items-center gap-1">
                <strong>Category:</strong> <SubjectCategoryBadge category={subj.category} />
              </p>
              <p><strong>Assigned Classes:</strong> {getClassNames(subj.assignedClasses)}</p>
              <p title={getTeacherNames(subj.assignedTeachers)}>
                <strong>Assigned Teachers:</strong> {subj.assignedTeachers?.length || 0}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
