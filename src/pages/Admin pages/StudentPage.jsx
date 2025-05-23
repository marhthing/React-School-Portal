import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import StudentSummary from "../../components/Admin UI/Student/StudentSummary";
import StudentSearchFilter from "../../components/Admin UI/Student/StudentSearchFilter";
import StudentTable from "../../components/Admin UI/Student/StudentTable";
import StudentModal from "../../components/Admin UI/Student/StudentModal";
import AddStudentButton from "../../components/Admin UI/Student/AddStudentButton";
import StudentExportButtons from "../../components/Admin UI/Student/StudentExportButtons";
import Pagination from "../../components/Admin UI/Pagination";
// import StudentBulkUpload from "../../components/Admin UI/Student/StudentBulkUpload";

const fetchStudentsFromAPI = async () => {
  return [
    {
      regNumber: "REG001",
      fullName: "Alice Johnson",
      gender: "Female",
      className: "Primary 1",
      phone: "123456789",
      password: "pass123",
    },
    {
      regNumber: "REG002",
      fullName: "Bob Smith",
      gender: "Male",
      className: "Primary 2",
      phone: "987654321",
      password: "password",
    },
    // ...add more sample students as needed
  ];
};

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
const [searchQuery, setSearchQuery] = useState({
  name: "",
  className: "",
  regNumber: ""
});
  const [modalMode, setModalMode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10); // default mobile

  useEffect(() => {
    (async () => {
      const data = await fetchStudentsFromAPI();
      setStudents(data);
      setFilteredStudents(data);
    })();
  }, []);

  useEffect(() => {
    // Responsive items per page: 10 mobile, 50 desktop (md breakpoint 768px)
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleResize = () => {
      if (mediaQuery.matches) {
        setItemsPerPage(50);
      } else {
        setItemsPerPage(10);
      }
    };

    handleResize(); // initial check

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

useEffect(() => {
  let temp = [...students];

  if ((searchQuery.name || "").trim()) {
    temp = temp.filter((s) =>
      s.fullName.toLowerCase().includes(searchQuery.name.toLowerCase())
    );
  }

  if (searchQuery.className) {
    temp = temp.filter((s) => s.className === searchQuery.className);
  }

  if ((searchQuery.regNumber || "").trim()) {
    temp = temp.filter((s) =>
      s.regNumber.toLowerCase().includes(searchQuery.regNumber.toLowerCase())
    );
  }

  setFilteredStudents(temp);
  setCurrentPage(1);
}, [searchQuery, students]);


  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  // If currentPage is out of range after filters or itemsPerPage changes, reset to 1
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const currentStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleAddOrEditSubmit = (formData) => {
    if (modalMode === "create") {
      setStudents((prev) => [...prev, formData]);
    } else if (modalMode === "edit") {
      setStudents((prev) =>
        prev.map((stu) =>
          stu.regNumber === formData.regNumber ? formData : stu
        )
      );
    }
    closeModal();
  };

  const handleDelete = (regNumber) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((stu) => stu.regNumber !== regNumber));
    }
  };

  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

// const handleBulkUpload = (newStudents) => {
//   setStudents((prevStudents) => {
//     const existingRegs = new Set(prevStudents.map(s => s.regNumber));
//     // Only add new students whose regNumber is not already in the list
//     const filteredNewStudents = newStudents.filter(s => !existingRegs.has(s.regNumber));
//     return [...prevStudents, ...filteredNewStudents];
//   });
// };


  return (
    <AdminLayout>
      <div className="space-y-6 p-4 mt-20">
        {/* Header: Summary */}
        <StudentSummary totalStudents={students.length} />

        {/* Search, Add Button, Export Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="w-full">
          <StudentSearchFilter
            onFilterChange={handleSearchChange}  // Correct prop name
          />

          </div>
          <div className="w-full">
            <AddStudentButton onClick={openCreateModal} />
          </div>
          <div className="w-full">
            <StudentExportButtons students={filteredStudents} />
          </div>
        </div>

        {/* Bulk Upload */}
        {/* <div className="w-full">
          <StudentBulkUpload onStudentsUploaded={handleBulkUpload} />
        </div> */}

        {/* Student Table */}
        <div className="w-full overflow-x-auto rounded-lg shadow-sm">
          <StudentTable
            students={currentStudents}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Modal */}
        {modalOpen && (
          <StudentModal
            mode={modalMode}
            studentData={editingStudent}
            onSubmit={handleAddOrEditSubmit}
            onClose={closeModal}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentPage;
