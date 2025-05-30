import React, { useState, useEffect } from "react";
import Spinner from '../../Spinner'

export default function SubjectModal({
  student,
  allSubjects = [],
  loading = false,
  error = null,
  actionLoading = false,
  onSubmit, // function(updatedSubjects: { subject_id, subject_name, registered }[]) => void
  onClose,
}) {
  if (!student) return null;

  const [updatedSubjects, setUpdatedSubjects] = useState([]);

  useEffect(() => {
    const initialized = allSubjects.map((sub) => ({
      subject_id: sub.subject_id || sub.id,
      subject_name: sub.subject_name || sub.name,
      registered: !!sub.registered,
    }));
    setUpdatedSubjects(initialized);
  }, [allSubjects]);

  const handleCheckboxChange = (subjectId) => {
    setUpdatedSubjects((prev) =>
      prev.map((sub) =>
        sub.subject_id === subjectId
          ? { ...sub, registered: !sub.registered }
          : sub
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(updatedSubjects);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="subject-modal-title"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="subject-modal-title"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        >
          Subject Registration for {student.name || "Unknown"} (
          {student.reg_no || "N/A"})
        </h2>

        {loading && (
          <p className="text-gray-600 dark:text-gray-400"><Spinner /></p>
        )}

        {error && (
          <p className="mb-4 text-red-600 dark:text-red-400 font-semibold">
            Error: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300 select-none">
                      Subject
                    </th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700 dark:text-gray-300 select-none">
                      Register
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {updatedSubjects.length > 0 ? (
                    updatedSubjects.map((subject) => (
                      <tr
                        key={subject.subject_id}
                        className="even:bg-gray-50 dark:even:bg-gray-800"
                      >
                        <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                          {subject.subject_name}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={subject.registered}
                            onChange={() => handleCheckboxChange(subject.subject_id)}
                            disabled={actionLoading}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No subjects available for this class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={actionLoading}
                className="bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                {actionLoading ? <Spinner /> : "Update Subjects"}
              </button>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Close modal"
          type="button"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
