import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import StudentSummary from "../../components/Admin UI/Student/StudentSummary";
import StudentSearchFilter from "../../components/Admin UI/Student/StudentSearchFilter";
import StudentTable from "../../components/Admin UI/Student/StudentTable";
import StudentModal from "../../components/Admin UI/Student/StudentModal";
import AddStudentButton from "../../components/Admin UI/Student/AddStudentButton";
import StudentExportButtons from "../../components/Admin UI/Student/StudentExportButtons";
import Pagination from "../../components/Admin UI/Pagination";
import Spinner from "../../components/Spinner";

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    classId: "",    // changed from className to classId
    regNumber: "",
  });
  const [modalMode, setModalMode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [classOptions, setClassOptions] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Fetch classes from API - get array of {id, name}
  useEffect(() => {
    async function fetchClasses() {
      setLoadingClasses(true);
      try {
        const res = await fetch("http://localhost/sfgs_api/api/get_classes.php");
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data = await res.json();
        // Assuming API returns array directly or in data.classes
        setClassOptions(data.classes || data || []);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoadingClasses(false);
      }
    }
    fetchClasses();
  }, []);

  // Fetch students from API
  useEffect(() => {
    async function fetchStudents() {
      setLoadingStudents(true);
      try {
        const res = await fetch("http://localhost/sfgs_api/api/students.php");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    }
    fetchStudents();
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

  // Filter students based on searchQuery
 useEffect(() => {
  let temp = [...students];

  if (searchQuery.name.trim()) {
    temp = temp.filter((s) =>
      s.fullName.toLowerCase().includes(searchQuery.name.toLowerCase())
    );
  }

  if (searchQuery.classId) {
    temp = temp.filter(
      (s) => String(s.classId) === String(searchQuery.classId)
    );
  }

  if (searchQuery.regNumber.trim()) {
    temp = temp.filter((s) =>
      s.regNumber.toLowerCase().includes(searchQuery.regNumber.toLowerCase())
    );
  }

  setFilteredStudents(temp);
  setCurrentPage(1);
}, [searchQuery, students]);


  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openCreateModal = () => {
    setModalMode("create");
    setEditingStudent(null);
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setModalMode("edit");
    setEditingStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
  };

  // Add or Edit student submit handler
  const handleAddOrEditSubmit = async (formData) => {
    if (modalMode === "create") {
      try {
        const res = await fetch("http://localhost/sfgs_api/api/students.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          const newStudent = { ...formData, regNumber: data.regNumber || formData.regNumber };
          setStudents((prev) => [...prev, newStudent]);
        } else {
          alert("Error adding student: " + (data.error || "Unknown error"));
        }
      } catch (error) {
        console.error(error);
        alert("Error adding student");
      }
    } else if (modalMode === "edit") {
      try {
        const res = await fetch(
          `http://localhost/sfgs_api/api/students.php?id=${formData.regNumber}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const data = await res.json();
        if (data.success) {
          setStudents((prev) =>
            prev.map((stu) => (stu.regNumber === formData.regNumber ? formData : stu))
          );
        } else {
          alert("Error updating student: " + (data.error || "Unknown error"));
        }
      } catch (error) {
        console.error(error);
        alert("Error updating student");
      }
    }
    closeModal();
  };

  // Delete student handler
  const handleDelete = async (regNumber) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(
        `http://localhost/sfgs_api/api/students.php?id=${regNumber}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.regNumber !== regNumber)
        );
      } else {
        alert("Error deleting student: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting student");
    }
  };

  // Search filter change
const handleSearchChange = (newQuery) => {
  setSearchQuery(newQuery);
};


  // Pagination change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Show spinner while loading data
  if (loadingClasses || loadingStudents) {
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
        <StudentSummary totalStudents={students.length} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <StudentSearchFilter
            filterValues={searchQuery}
            onFilterChange={handleSearchChange}
            classOptions={classOptions}
          />

          <AddStudentButton onOpen={openCreateModal} />

          <StudentExportButtons students={filteredStudents} />
        </div>

        <div className="w-full overflow-x-auto rounded-lg shadow-sm">
          <StudentTable
            students={currentStudents}
            onEditStudent={openEditModal}
            onDelete={handleDelete}
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {modalOpen && (
          <StudentModal
            mode={modalMode}
            studentData={editingStudent}
            onSubmit={handleAddOrEditSubmit}
            onClose={closeModal}
            classOptions={classOptions}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentPage;
