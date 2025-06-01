import React, { useState, useEffect } from 'react';
import Spinner from "../../ui/Spinner";

export default function AddEditSubjectModal({
  subject,
  classes,
  teachers,
  onClose,
  onSave,
}) {
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [category, setCategory] = useState('General');
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setName(subject.name || '');
      setAbbreviation(subject.abbreviation || '');
      setCategory(subject.category || 'General');
      setAssignedClasses(subject.assignedClasses || []);
      setAssignedTeachers(subject.assignedTeachers || []);
    } else {
      setName('');
      setAbbreviation('');
      setCategory('General');
      setAssignedClasses([]);
      setAssignedTeachers([]);
    }
  }, [subject]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function handleClassToggle(classId) {
    const id = Number(classId);
    setAssignedClasses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleTeacherToggle(teacherId) {
    setAssignedTeachers((prev) =>
      prev.includes(teacherId) ? prev.filter((id) => id !== teacherId) : [...prev, teacherId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !abbreviation.trim()) {
      alert('Please fill in both Subject Name and Abbreviation.');
      return;
    }
    setIsLoading(true);
    try {
      await onSave({
        id: subject?.id,
        name: name.trim(),
        abbreviation: abbreviation.trim(),
        category,
        assignedClasses,
        assignedTeachers,
      });
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving.');
    }
    setIsLoading(false);
  }

  const categories = ['General', 'Science', 'Art', 'Junior'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4">
          {subject ? 'Edit Subject' : 'Add New Subject'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Subject Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="abbreviation" className="block mb-1 font-medium">Abbreviation</label>
            <input
              id="abbreviation"
              type="text"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="category" className="block mb-1 font-medium">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Assigned Classes</label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border rounded p-2">
              {classes
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((cls) => (
                  <label key={cls.id} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={assignedClasses.includes(Number(cls.id))}
                      onChange={() => handleClassToggle(Number(cls.id))}
                      disabled={isLoading}
                    />
                    <span>{cls.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Assigned Teachers</label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border rounded p-2">
              {teachers
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((teacher) => (
                  <label key={teacher.id} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={assignedTeachers.includes(teacher.id)}
                      onChange={() => handleTeacherToggle(teacher.id)}
                      disabled={isLoading}
                    />
                    <span>{teacher.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded bg-blue-600 text-white flex items-center justify-center space-x-2 hover:bg-blue-700 ${
                isLoading ? 'cursor-not-allowed opacity-70' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 text-white animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
