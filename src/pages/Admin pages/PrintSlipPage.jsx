import React, { useState, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import StudentSlipDetails from "../../components/Admin UI/Slip/StudentSlipDetails";
import PrintButton from "../../components/Admin UI/Slip/PrintButton";

const PrintSlipPage = () => {
  // State for dark mode, you can lift this up in your app if preferred
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [regNumber, setRegNumber] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const printRef = useRef();

  // Mock API fetch function - replace with real API call
  const fetchStudentInfo = async (regNum) => {
    await new Promise((res) => setTimeout(res, 500));

    const mockDatabase = {
      STU001: {
        regNumber: "STU001",
        name: "John Doe",
        gender: "Male",
        class: "SS1A",
        phone: "08012345678",
        email: "john.doe@example.com",
      },
      STU002: {
        regNumber: "STU002",
        name: "Jane Smith",
        gender: "Female",
        class: "SS2B",
        phone: "08087654321",
        email: "jane.smith@example.com",
      },
    };

    return mockDatabase[regNum] || null;
  };

  const handleSearch = async () => {
    setNotFound(false);
    setStudentInfo(null);

    if (!regNumber.trim()) return;

    const result = await fetchStudentInfo(regNumber.trim().toUpperCase());

    if (result) {
      setStudentInfo(result);
    } else {
      setNotFound(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <AdminLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <div className="max-w-4xl mx-auto p-4 mt-20">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Print Student Slip
        </h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Student Registration Number"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow border border-gray-300 rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {studentInfo && (
          <>
            <div ref={printRef} className="mb-4">
              <StudentSlipDetails student={studentInfo} />
            </div>
            <PrintButton printRef={printRef} />
          </>
        )}

        {notFound && (
          <p className="text-red-600 font-semibold">Student not found.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default PrintSlipPage;
