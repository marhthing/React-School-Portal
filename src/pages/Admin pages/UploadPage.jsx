// src/pages/UploadPage.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

import ResultFormFilter from "../../components/Admin UI/Upload/ResultFormFilter";
import ScoreInputTable from "../../components/Admin UI/Upload/ScoreInputTable";
import ScoreInputCardList from "../../components/Admin UI/Upload/ScoreInputCardList";
import SubmitScoresButton from "../../components/Admin UI/Upload/SubmitScoresButton";
import ResultToast from "../../components/Admin UI/Upload/ResultToast";

const MAX_TOTAL_SCORE = 100;

// Dummy data for filter lists (will eventually come from backend)
const classesList = ["SSS1A", "SSS1B", "SSS2A", "SSS2B", "SSS3A", "SSS3B"];
const termsList = ["First Term", "Second Term", "Third Term"];
const sessionsList = ["2023/2024", "2024/2025", "2025/2026"];
const subjectsByClass = {
  SSS1A: ["Mathematics", "English", "Biology"],
  SSS1B: ["Mathematics", "English", "Chemistry"],
  SSS2A: ["Physics", "Economics", "Geography"],
  SSS2B: ["Biology", "Government", "Commerce"],
  SSS3A: ["Mathematics", "Physics", "Literature"],
  SSS3B: ["Economics", "Government", "History"],
};

const UploadPage = () => {
  // Filters state
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");

  // Student scores array [{ id, name, regNo, ca1, ca2, exam, total, errors }]
  const [studentsScores, setStudentsScores] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Responsive layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Optional: If you want to manage dark mode here or get from AdminLayout via context/prop,
  // for now let's default it to false (light mode)
  const darkMode = false;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedTerm && selectedSession) {
      fetchStudentsAndScores();
    } else {
      setStudentsScores([]);
      setIsEditMode(false);
    }
  }, [selectedClass, selectedSubject, selectedTerm, selectedSession]);

  const fetchStudentsAndScores = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Dummy students fetch, replace with real API call
      const students = [
        { id: 1, name: "John Doe", regNo: "AUL/001" },
        { id: 2, name: "Jane Smith", regNo: "AUL/002" },
        { id: 3, name: "Michael Brown", regNo: "AUL/003" },
      ];

      const scoresData = students.map((stu) => ({
        id: stu.id,
        name: stu.name,
        regNo: stu.regNo,
        ca1: "",
        ca2: "",
        exam: "",
        total: 0,
        errors: {},
      }));

      setStudentsScores(scoresData);
      setIsEditMode(false);
    } catch (error) {
      setErrorMsg("Failed to fetch students or scores.");
      setStudentsScores([]);
      setIsEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (studentId, field, value) => {
    setStudentsScores((prev) =>
      prev.map((stu) => {
        if (stu.id === studentId) {
          const updated = {
            ...stu,
            [field]: value === "" ? "" : Number(value),
          };
          const ca1Val = Number(updated.ca1) || 0;
          const ca2Val = Number(updated.ca2) || 0;
          const examVal = Number(updated.exam) || 0;
          updated.total = ca1Val + ca2Val + examVal;

          const errors = { ...updated.errors };
          if (updated.total > MAX_TOTAL_SCORE) {
            errors.total = "Total score cannot exceed 100";
          } else {
            delete errors.total;
          }
          updated.errors = errors;

          return updated;
        }
        return stu;
      })
    );
  };

  const validateAll = () => {
    let valid = true;
    const updatedScores = studentsScores.map((stu) => {
      const errors = {};

      const ca1Val = Number(stu.ca1) || 0;
      const ca2Val = Number(stu.ca2) || 0;
      const examVal = Number(stu.exam) || 0;
      const total = ca1Val + ca2Val + examVal;

      if (total > MAX_TOTAL_SCORE) {
        errors.total = "Total score cannot exceed 100";
        valid = false;
      }
      if (ca1Val < 0 || ca1Val > 20) {
        errors.ca1 = "CA1 must be between 0 and 20";
        valid = false;
      }
      if (ca2Val < 0 || ca2Val > 20) {
        errors.ca2 = "CA2 must be between 0 and 20";
        valid = false;
      }
      if (examVal < 0 || examVal > 60) {
        errors.exam = "Exam must be between 0 and 60";
        valid = false;
      }

      return { ...stu, errors };
    });

    setStudentsScores(updatedScores);
    return valid;
  };

  const handleSave = async () => {
    if (!validateAll()) {
      setErrorMsg("Please fix errors before saving.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Simulate save call
      await new Promise((r) => setTimeout(r, 1000));
      setSuccessMsg("Scores saved successfully!");
    } catch (error) {
      setErrorMsg("Failed to save scores.");
    } finally {
      setSaving(false);
    }
  };

 return (
  <AdminLayout>
    <div className="space-y-10 p-4 mt-20 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload / Edit Scores</h1>

      <ResultFormFilter
        darkMode={darkMode}
        classesList={classesList}
        termsList={termsList}
        sessionsList={sessionsList}
        subjectsByClass={subjectsByClass}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedTerm={selectedTerm}
        onTermChange={setSelectedTerm}
        selectedSession={selectedSession}
        onSessionChange={setSelectedSession}
      />

      {loading && <p className="mt-4">Loading students and scores...</p>}

      {!loading && studentsScores.length > 0 && (
        <>
          {isMobile ? (
            <ScoreInputCardList
              studentsScores={studentsScores}
              onScoreChange={handleScoreChange}
            />
          ) : (
            <ScoreInputTable
              studentsScores={studentsScores}
              onScoreChange={handleScoreChange}
              darkMode={darkMode}
            />
          )}

          <SubmitScoresButton 
            onClick={handleSave} 
            isLoading={saving} 
            disabled={studentsScores.length === 0} 
          />

        </>
      )}

      {!loading && studentsScores.length === 0 && (
        <p className="mt-4 text-gray-500">Please select all filters to load students.</p>
      )}

      {errorMsg && <ResultToast type="error" message={errorMsg} />}
      {successMsg && <ResultToast type="success" message={successMsg} />}
    </div>
  </AdminLayout>
);

};

export default UploadPage;
