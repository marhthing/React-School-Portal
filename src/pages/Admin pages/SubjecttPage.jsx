import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/ui/AdminLayout';
import SubjectFilters from '../../components/Admin UI/Subject/SubjectFilters';
import SubjectsTable from '../../components/Admin UI/Subject/SubjectsTable';
import AddEditSubjectModal from '../../components/Admin UI/Subject/AddEditSubjectModal';
import AssignTeachersModal from '../../components/Admin UI/Subject/AssignTeachersModal';
import ConfirmDeleteModal from '../../components/Admin UI/Subject/ConfirmDeleteModal';
import Spinner from "../../components/ui/Spinner";


const API_SUBJECTS = "http://localhost/sfgs_api/api/subjects.php";
const API_CLASSES = "http://localhost/sfgs_api/api/get_classes.php";
const API_TEACHERS = "http://localhost/sfgs_api/api/get_teachers.php";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterTeacher, setFilterTeacher] = useState('');

  // Modal state
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [isAssignTeachersModalOpen, setAssignTeachersModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);

  // Currently selected subject
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [loadingSubjects, setLoadingSubjects] = useState(true);


  // Fetch all initial data on mount
  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

async function fetchSubjects() {
  setLoadingSubjects(true);
  try {
    const res = await fetch(API_SUBJECTS, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch subjects');
    const data = await res.json();
    setSubjects(data);
  } catch (error) {
    console.error('Fetch subjects error:', error);
  } finally {
    setLoadingSubjects(false);
  }
}


  async function fetchClasses() {
    try {
      const res = await fetch(API_CLASSES, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch classes');
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error('Fetch classes error:', error);
    }
  }

  async function fetchTeachers() {
    try {
      const res = await fetch(API_TEACHERS, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch teachers');
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error('Fetch teachers error:', error);
    }
  }

  // Filtered subjects memoized for performance
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subj) => {
      const search = searchTerm.toLowerCase();
      if (
        search &&
        !(
          subj.name.toLowerCase().includes(search) ||
          (subj.abbreviation && subj.abbreviation.toLowerCase().includes(search))
        )
      ) return false;

      if (filterCategory && subj.category !== filterCategory) return false;

      if (filterClass && (!subj.assignedClasses || !subj.assignedClasses.includes(filterClass))) return false;

      if (filterTeacher && (!subj.assignedTeachers || !subj.assignedTeachers.includes(parseInt(filterTeacher, 10)))) return false;

      return true;
    });
  }, [subjects, searchTerm, filterCategory, filterClass, filterTeacher]);

  // Modal handlers
  function openAddEditModal(subject = null) {
    setSelectedSubject(subject);
    setAddEditModalOpen(true);
  }
  function closeAddEditModal() {
    setSelectedSubject(null);
    setAddEditModalOpen(false);
  }

  function openAssignTeachersModal(subject) {
    setSelectedSubject(subject);
    setAssignTeachersModalOpen(true);
  }
  function closeAssignTeachersModal() {
    setSelectedSubject(null);
    setAssignTeachersModalOpen(false);
  }

  function openConfirmDeleteModal(subject) {
    setSelectedSubject(subject);
    setConfirmDeleteModalOpen(true);
  }
  function closeConfirmDeleteModal() {
    setSelectedSubject(null);
    setConfirmDeleteModalOpen(false);
  }

  // Save (Add or Update) subject via API
  async function handleSaveSubject(subjectData) {
    try {
      if (subjectData.id) {
        // Update existing subject
        const res = await fetch(`${API_SUBJECTS}?id=${subjectData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subjectData),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to update subject');
        const updatedSubject = await res.json();

        setSubjects((prev) =>
          prev.map((subj) => (subj.id === updatedSubject.id ? updatedSubject : subj))
        );
      } else {
        // Add new subject
        const res = await fetch(API_SUBJECTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subjectData),
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to add subject');
        const newSubject = await res.json();

        setSubjects((prev) => [...prev, newSubject]);
      }
      closeAddEditModal();
    } catch (error) {
      console.error('Save subject error:', error);
      alert('Failed to save subject. Please try again.');
    }
  }

  // Delete subject via API
  async function handleDeleteSubject(subjectId) {
    try {
      const res = await fetch(`${API_SUBJECTS}?id=${subjectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete subject');
      const result = await res.json();
      if (result.success) {
        setSubjects((prev) => prev.filter((subj) => subj.id !== subjectId));
        closeConfirmDeleteModal();
      } else {
        throw new Error('Delete operation unsuccessful');
      }
    } catch (error) {
      console.error('Delete subject error:', error);
      alert('Failed to delete subject. Please try again.');
    }
  }

async function handleUpdateAssignedTeachers(subjectId, assignedTeacherIds) {
  try {
    const res = await fetch(API_SUBJECTS, {  // no ?id= here
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: subjectId, assignedTeachers: assignedTeacherIds }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to update assigned teachers');
    const updatedSubject = await res.json();

    setSubjects((prev) =>
      prev.map((subj) => (subj.id === subjectId ? updatedSubject : subj))
    );
    closeAssignTeachersModal();
  } catch (error) {
    console.error('Assign teachers error:', error);
    alert('Failed to assign teachers. Please try again.');
  }
}




  return (
    <AdminLayout>
      <div className="p-4 mt-20">
        <h1 className="text-2xl font-bold mb-4">Subjects Management</h1>

        <SubjectFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          filterClass={filterClass}
          onClassChange={setFilterClass}
          filterTeacher={filterTeacher}
          onTeacherChange={setFilterTeacher}
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

       {loadingSubjects ? (
  <div className="flex justify-center items-center h-40">
    <Spinner />
  </div>
) : (
  <SubjectsTable
    subjects={filteredSubjects}
    classes={classes}
    teachers={teachers}
    onEdit={openAddEditModal}
    onDelete={openConfirmDeleteModal}
    onAssignTeachers={openAssignTeachersModal}
  />
)}


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
