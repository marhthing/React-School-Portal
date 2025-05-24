import React, { useState, useEffect } from 'react';

export default function AssignTeachersModal({
  subject,
  teachers,
  onClose,
  onSave,
}) {
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  useEffect(() => {
    if (subject) {
      setSelectedTeachers(subject.assignedTeachers || []);
    } else {
      setSelectedTeachers([]);
    }
  }, [subject]);

  function toggleTeacher(id) {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(subject.id, selectedTeachers);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">
          Assign Teachers to {subject?.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto border rounded p-2">
            {teachers.map((teacher) => (
              <label
                key={teacher.id}
                className="inline-flex items-center space-x-2 w-full"
              >
                <input
                  type="checkbox"
                  checked={selectedTeachers.includes(teacher.id)}
                  onChange={() => toggleTeacher(teacher.id)}
                />
                <span>{teacher.name}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
