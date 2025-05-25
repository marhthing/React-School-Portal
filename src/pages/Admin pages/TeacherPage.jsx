import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import TeacherSummary from "../../components/Admin UI/Teacher/TeacherSummary";
import TeacherSearchFilter from "../../components/Admin UI/Teacher/TeacherSearchFilter";
import TeacherTable from "../../components/Admin UI/Teacher/TeachersTable";
import TeacherModal from "../../components/Admin UI/Teacher/TeacherModal";
import AddTeacherButton from "../../components/Admin UI/Teacher/AddTeacherButton";
import TeacherExportButtons from "../../components/Admin UI/Teacher/TeacherExportButtons";
import Pagination from "../../components/Admin UI/Pagination";
import ConfirmDeleteModal from "../../components/Admin UI/Teacher/ConfirmDeleteModal";
import Spinner from "../../components/Spinner";  // <-- import Spinner

const API_URL = "http://localhost/sfgs_api/api/teachers.php";

const fetchTeachersFromAPI = async () => {
  try {
    const response = await fetch(API_URL, { method: "GET" });
    if (!response.ok) throw new Error("Failed to fetch teachers");
    const data = await response.json();
    return data.teachers || [];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
};

const createTeacherAPI = async (teacherData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacherData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to create teacher");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const updateTeacherAPI = async (id, teacherData) => {
  try {
    const url = `${API_URL}?id=${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacherData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to update teacher");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const deleteTeacherAPI = async (id) => {
  try {
    const url = `${API_URL}?id=${id}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to delete teacher");
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    role: "",
    email: "",
  });
  const [modalMode, setModalMode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [loading, setLoading] = useState(true);  // <-- loading state

  // Fetch teachers on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchTeachersFromAPI();
      setTeachers(data);
      setFilteredTeachers(data);
      setLoading(false);
    })();
  }, []);

  // Responsive items per page
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      setItemsPerPage(mediaQuery.matches ? 50 : 10);
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Filter teachers based on search query
  useEffect(() => {
    let temp = [...teachers];

    if ((searchQuery.name || "").trim()) {
      temp = temp.filter((t) =>
        t.fullName.toLowerCase().includes(searchQuery.name.toLowerCase())
      );
    }

    if (searchQuery.role) {
      temp = temp.filter((t) => t.role === searchQuery.role);
    }

    if ((searchQuery.email || "").trim()) {
      temp = temp.filter((t) =>
        t.email.toLowerCase().includes(searchQuery.email.toLowerCase())
      );
    }

    setFilteredTeachers(temp);
    setCurrentPage(1);
  }, [searchQuery, teachers]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Open modals
  const openCreateModal = () => {
    setModalMode("create");
    setEditingTeacher(null);
    setModalOpen(true);
  };

  const openEditModal = (teacher) => {
    setModalMode("edit");
    setEditingTeacher(teacher);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTeacher(null);
  };

  // Handle create or update submit
  const handleAddOrEditSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        const response = await createTeacherAPI(formData);
        setTeachers((prev) => [
          ...prev,
          { ...formData, id: response.id },
        ]);
      } else if (modalMode === "edit") {
        await updateTeacherAPI(formData.id, formData);
        setTeachers((prev) =>
          prev.map((t) => (t.id === formData.id ? formData : t))
        );
      }
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const confirmDeleteTeacher = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    if (!teacher) return;
    setTeacherToDelete(teacher);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!teacherToDelete) return;
    try {
      await deleteTeacherAPI(teacherToDelete.id);
      setTeachers((prev) =>
        prev.filter((t) => t.id !== teacherToDelete.id)
      );
      setDeleteModalOpen(false);
      setTeacherToDelete(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteCancelled = () => {
    setDeleteModalOpen(false);
    setTeacherToDelete(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 mt-20">
        <TeacherSummary totalTeachers={teachers.length} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="w-full">
            <TeacherSearchFilter onFilterChange={setSearchQuery} />
          </div>
          <div className="w-full">
            <AddTeacherButton onClick={openCreateModal} />
          </div>
          <div className="w-full">
            <TeacherExportButtons teachers={filteredTeachers} />
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-lg shadow-sm">
          <TeacherTable
            teachers={currentTeachers}
            onEdit={openEditModal}
            onDelete={confirmDeleteTeacher}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {modalOpen && (
          <TeacherModal
            mode={modalMode}
            teacher={editingTeacher}
            onSubmit={handleAddOrEditSubmit}
            onClose={closeModal}
          />
        )}

        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onConfirm={handleDeleteConfirmed}
          onCancel={handleDeleteCancelled}
          message={
            teacherToDelete
              ? `Are you sure you want to delete teacher "${teacherToDelete.fullName}"?`
              : undefined
          }
        />
      </div>
    </AdminLayout>
  );
};

export default TeacherPage;
