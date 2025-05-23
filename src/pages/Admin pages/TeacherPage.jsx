import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import TeacherSummary from "../../components/Admin UI/Teacher/TeacherSummary";
import TeacherSearchFilter from "../../components/Admin UI/Teacher/TeacherSearchFilter";
import TeacherTable from "../../components/Admin UI/Teacher/TeachersTable";
import TeacherModal from "../../components/Admin UI/Teacher/TeacherModal";
import AddTeacherButton from "../../components/Admin UI/Teacher/AddTeacherButton";
import TeacherExportButtons from "../../components/Admin UI/Teacher/TeacherExportButtons";
import Pagination from "../../components/Admin UI/Pagination";

const fetchTeachersFromAPI = async () => {
  return [
    {
      id: "TCH001",
      fullName: "Mr. John Doe",
      gender: "Male",
      role: "Head Teacher",
      phone: "1234567890",
      email: "john@example.com",
      password: "securepass",
    },
    {
      id: "TCH002",
      fullName: "Ms. Jane Smith",
      gender: "Female",
      role: "Assistant Teacher",
      phone: "0987654321",
      email: "jane@example.com",
      password: "12345",
    },
  ];
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

  useEffect(() => {
    (async () => {
      const data = await fetchTeachersFromAPI();
      setTeachers(data);
      setFilteredTeachers(data);
    })();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = () => {
      setItemsPerPage(mediaQuery.matches ? 50 : 10);
    };
    handleResize();
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

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
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleAddOrEditSubmit = (formData) => {
    if (modalMode === "create") {
      setTeachers((prev) => [...prev, formData]);
    } else if (modalMode === "edit") {
      setTeachers((prev) =>
        prev.map((t) => (t.id === formData.id ? formData : t))
      );
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 mt-20">
        <TeacherSummary totalTeachers={teachers.length} />

      {/* Search, Add Button, Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="w-full">
          <TeacherSearchFilter
            onFilterChange={handleSearchChange}  // Correct prop name
          />
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
            onDelete={handleDelete}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {modalOpen && (
          <TeacherModal
            mode={modalMode}
            teacherData={editingTeacher}
            onSubmit={handleAddOrEditSubmit}
            onClose={closeModal}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TeacherPage;
