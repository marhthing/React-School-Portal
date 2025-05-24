import React, { useState, useEffect } from 'react';

export default function AddEditSubjectModal({
  subject,
  classes,
  teachers,
  onClose,
  onSave,
}) {
  // Local state for the form inputs
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [category, setCategory] = useState('General');
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [assignedTeachers, setAssignedTeachers] = useState([]);

  useEffect(() => {
    if (subject) {
      setName(subject.name || '');
      setAbbreviation(subject.abbreviation || '');
      setCategory(subject.category || 'General');
      setAssignedClasses(subject.assignedClasses || []);
      setAssignedTeachers(subject.assignedTeachers || []);
    } else {
      // Reset fields for new subject
      setName('');
      setAbbreviation('');
      setCategory('General');
      setAssignedClasses([]);
      setAssignedTeachers([]);
    }
  }, [subject]);

  function handleClassToggle(cls) {
    setAssignedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  }

  function handleTeacherToggle(teacherId) {
    setAssignedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !abbreviation.trim()) {
      alert('Please fill in both Subject Name and Abbreviation.');
      return;
    }

    onSave({
      id: subject?.id,
      name: name.trim(),
      abbreviation: abbreviation.trim(),
      category,
      assignedClasses,
      assignedTeachers,
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {subject ? 'Edit Subject' : 'Add New Subject'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Name */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-900 dark:text-gray-300"
              htmlFor="name"
            >
              Subject Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2
                         bg-white text-gray-900 placeholder-gray-500
                         dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                         dark:border-gray-600"
              required
              autoFocus
            />
          </div>

          {/* Abbreviation */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-900 dark:text-gray-300"
              htmlFor="abbreviation"
            >
              Abbreviation
            </label>
            <input
              id="abbreviation"
              type="text"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              className="w-full border rounded px-3 py-2
                         bg-white text-gray-900 placeholder-gray-500
                         dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                         dark:border-gray-600"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-900 dark:text-gray-300"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:text-gray-100
                         dark:border-gray-600"
            >
              <option value="General">General</option>
              <option value="Science">Science</option>
              <option value="Art">Art</option>
            </select>
          </div>

          {/* Assigned Classes (multi-select checkboxes) */}
          <div>
            <label className="block mb-1 font-medium text-gray-900 dark:text-gray-300">
              Assigned Classes
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border rounded p-2
                            bg-white text-gray-900
                            dark:bg-gray-700 dark:text-gray-100
                            dark:border-gray-600">
              {classes.map((cls) => (
                <label
                  key={cls}
                  className="inline-flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={assignedClasses.includes(cls)}
                    onChange={() => handleClassToggle(cls)}
                    className="form-checkbox h-5 w-5
                               text-blue-600
                               dark:text-blue-500
                               bg-white dark:bg-gray-700
                               border-gray-300 dark:border-gray-600
                               rounded"
                  />
                  <span>{cls}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assigned Teachers (multi-select checkboxes) */}
          <div>
            <label className="block mb-1 font-medium text-gray-900 dark:text-gray-300">
              Assigned Teachers
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border rounded p-2
                            bg-white text-gray-900
                            dark:bg-gray-700 dark:text-gray-100
                            dark:border-gray-600">
              {teachers.map((teacher) => (
                <label
                  key={teacher.id}
                  className="inline-flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={assignedTeachers.includes(teacher.id)}
                    onChange={() => handleTeacherToggle(teacher.id)}
                    className="form-checkbox h-5 w-5
                               text-blue-600
                               dark:text-blue-500
                               bg-white dark:bg-gray-700
                               border-gray-300 dark:border-gray-600
                               rounded"
                  />
                  <span>{teacher.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100
                         bg-white text-gray-900
                         dark:bg-gray-700 dark:text-gray-100
                         dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
