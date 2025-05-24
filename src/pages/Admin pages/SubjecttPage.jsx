import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';  // <-- import AdminLayout
import SubjectFilters from '../../components/Admin UI/Subject/SubjectFilters';
import SubjectsTable from '../../components/Admin UI/Subject/SubjectsTable';
import AddEditSubjectModal from '../../components/Admin UI/Subject/AddEditSubjectModal';
import AssignTeachersModal from '../../components/Admin UI/Subject/AssignTeachersModal';
import ConfirmDeleteModal from '../../components/Admin UI/Subject/ConfirmDeleteModal';

const dummySubjects = [
  {
    id: 1,
    name: 'Mathematics',
    abbreviation: 'MATH',
    category: 'Science',
    assignedClasses: ['Grade 9', 'Grade 10'],
    assignedTeachers: [1, 2],
  },
  {
    id: 2,
    name: 'History',
    abbreviation: 'HIST',
    category: 'General',
    assignedClasses: ['Grade 9'],
    assignedTeachers: [3],
  },
  // ... more dummy subjects
];

const dummyClasses = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

const dummyTeachers = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Davis' },
];

export default function SubjectsPage() {
  // All subject data & related data
  const [subjects, setSubjects] = useState(dummySubjects);
  const [classes] = useState(dummyClasses);
  const [teachers] = useState(dummyTeachers);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');

  // Modals state
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [isAssignTeachersModalOpen, setAssignTeachersModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  // Currently selected subject for editing/assigning/deleting
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Filtered subjects memoized for performance
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subj) => {
      // Search filter (name or abbreviation)
      const search = searchTerm.toLowerCase();
      if (
        search &&
        !(
          subj.name.toLowerCase().includes(search) ||
          subj.abbreviation.toLowerCase().includes(search)
        )
      ) {
        return false;
      }

      // Category filter
      if (filterCategory && subj.category !== filterCategory) {
        return false;
      }

      // Class filter
      if (filterClass && !subj.assignedClasses.includes(filterClass)) {
        return false;
      }

      // Teacher filter
      if (
        filterTeacher &&
        !subj.assignedTeachers.includes(parseInt(filterTeacher, 10))
      ) {
        return false;
      }

      return true;
    });
  }, [subjects, searchTerm, filterCategory, filterClass, filterTeacher]);

  // Handlers for filter changes
  function handleSearchChange(value) {
    setSearchTerm(value);
  }

  function handleCategoryChange(value) {
    setFilterCategory(value);
  }

  function handleClassChange(value) {
    setFilterClass(value);
  }

  function handleTeacherChange(value) {
    setFilterTeacher(value);
  }

  // Open Add/Edit modal for new or existing subject
  function openAddEditModal(subject = null) {
    setSelectedSubject(subject);
    setAddEditModalOpen(true);
  }

  function closeAddEditModal() {
    setSelectedSubject(null);
    setAddEditModalOpen(false);
  }

  // Open Assign Teachers modal
  function openAssignTeachersModal(subject) {
    setSelectedSubject(subject);
    setAssignTeachersModalOpen(true);
  }

  function closeAssignTeachersModal() {
    setSelectedSubject(null);
    setAssignTeachersModalOpen(false);
  }

  // Open Confirm Delete modal
  function openConfirmDeleteModal(subject) {
    setSelectedSubject(subject);
    setConfirmDeleteModalOpen(true);
  }

  function closeConfirmDeleteModal() {
    setSelectedSubject(null);
    setConfirmDeleteModalOpen(false);
  }

  // Add new subject or update existing
  function handleSaveSubject(subjectData) {
    if (subjectData.id) {
      // Update existing
      setSubjects((prev) =>
        prev.map((subj) => (subj.id === subjectData.id ? subjectData : subj))
      );
    } else {
      // Add new, generate new id
      const newId = Math.max(0, ...subjects.map((s) => s.id)) + 1;
      setSubjects((prev) => [...prev, { ...subjectData, id: newId }]);
    }
    closeAddEditModal();
  }

  // Update assigned teachers of a subject
  function handleUpdateAssignedTeachers(subjectId, assignedTeacherIds) {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.id === subjectId
          ? { ...subj, assignedTeachers: assignedTeacherIds }
          : subj
      )
    );
    closeAssignTeachersModal();
  }

  // Delete subject
  function handleDeleteSubject(subjectId) {
    setSubjects((prev) => prev.filter((subj) => subj.id !== subjectId));
    closeConfirmDeleteModal();
  }

  return (
    <AdminLayout>
      <div className="p-4 mt-20">
        <h1 className="text-2xl font-bold mb-4">Subjects Management</h1>

        <SubjectFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterCategory={filterCategory}
          onCategoryChange={handleCategoryChange}
          filterClass={filterClass}
          onClassChange={handleClassChange}
          filterTeacher={filterTeacher}
          onTeacherChange={handleTeacherChange}
          classes={classes}
          teachers={teachers}
        />

        <div className="my-4 flex justify-end">
          <button
            onClick={() => openAddEditModal(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add New Subject
          </button>
        </div>

        <SubjectsTable
          subjects={filteredSubjects}
          classes={classes}
          teachers={teachers}
          onEdit={openAddEditModal}
          onDelete={openConfirmDeleteModal}
          onAssignTeachers={openAssignTeachersModal}
        />

        {isAddEditModalOpen && (
          <AddEditSubjectModal
            subject={selectedSubject}
            classes={classes}
            teachers={teachers}
            onClose={closeAddEditModal}
            onSave={handleSaveSubject}
          />
        )}

        {isAssignTeachersModalOpen && selectedSubject && (
          <AssignTeachersModal
            subject={selectedSubject}
            teachers={teachers}
            onClose={closeAssignTeachersModal}
            onSave={handleUpdateAssignedTeachers}
          />
        )}

        {isConfirmDeleteModalOpen && selectedSubject && (
          <ConfirmDeleteModal
            message={`Are you sure you want to delete subject "${selectedSubject.name}"?`}
            onConfirm={() => handleDeleteSubject(selectedSubject.id)}
            onCancel={closeConfirmDeleteModal}
          />
        )}
      </div>
    </AdminLayout>
  );
}
