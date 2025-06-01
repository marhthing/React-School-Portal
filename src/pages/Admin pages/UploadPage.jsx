import React, { useState, useEffect } from "react";
import AdminLayout from '../../components/ui/AdminLayout';

import ResultFormFilter from "../../components/Admin UI/Upload/ResultFormFilter";
import ScoreInputTable from "../../components/Admin UI/Upload/ScoreInputTable";
import ScoreInputCardList from "../../components/Admin UI/Upload/ScoreInputCardList";
import SubmitScoresButton from "../../components/Admin UI/Upload/SubmitScoresButton";
import ResultToast from "../../components/Admin UI/Upload/ResultToast";
import Spinner from "../../components/ui/Spinner";

const MAX_TOTAL_SCORE = 100;

const UploadPage = () => {
  // Filters state
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [sessionsList, setSessionsList] = useState([]);

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
const [subjectsByClass, setSubjectsByClass] = React.useState({});

  // Responsive layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Terms are fixed - you can keep this or load from backend if needed
  const termsList = ["First Term", "Second Term", "Third Term"];

  const darkMode = false; // For now

  // Fetch classes, subjects, sessions on mount
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchSessions();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await fetch("http://localhost/sfgs_api/api/get_classes.php");
      const data = await res.json();
      setClassesList(data); // data is array of {id, name}
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };
const groupSubjectsByClass = (subjects) => {
  const map = {};
  subjects.forEach((subject) => {
    subject.assignedClasses.forEach((classId) => {
      if (!map[classId]) {
        map[classId] = [];
      }
      map[classId].push(subject);
    });
  });
  return map;
};

  // Fetch subjects
const fetchSubjects = async () => {
  try {
    const res = await fetch("http://localhost/sfgs_api/api/subjects.php");
    const data = await res.json();
    setSubjectsList(data);
    setSubjectsByClass(groupSubjectsByClass(data));  // <-- Add this line
  } catch (error) {
    console.error("Failed to fetch subjects", error);
  }
};


  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost/sfgs_api/api/sessions.php");
      const data = await res.json();
      setSessionsList(data); // data is array of {id, name}
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  // When filters change and all selected, fetch scores + students
  useEffect(() => {
    if (selectedClass && selectedSubject && selectedTerm && selectedSession) {
      fetchStudentsAndScores();
    } else {
      setStudentsScores([]);
      setIsEditMode(false);
    }
  }, [selectedClass, selectedSubject, selectedTerm, selectedSession]);

  // Fetch scores for selected filters
  const fetchStudentsAndScores = async () => {
  setLoading(true);
  setErrorMsg("");
  setSuccessMsg("");

  try {
    const url = new URL("http://localhost/sfgs_api/api/scores.php");
    url.searchParams.append("classId", selectedClass);
    url.searchParams.append("subjectId", selectedSubject);
    url.searchParams.append("term", selectedTerm);
    url.searchParams.append("sessionId", selectedSession);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch scores");

    const data = await res.json();
    const scoresArray = Array.isArray(data.scores) ? data.scores : [];

    const mappedScores = scoresArray.map((item, index) => ({
      id: index + 1, // Or use item.student_id if available
      name: item.student_name,
      regNo: item.student_reg_number,  // ✅ Correct field from API
      subject_id: item.subject_id || selectedSubject,
      ca1: item.ca1 ?? "",
      ca2: item.ca2 ?? "",
      exam: item.exam ?? "",
      total: (Number(item.ca1 ?? 0) + Number(item.ca2 ?? 0) + Number(item.exam ?? 0)),
      errors: {},
    }));

    setStudentsScores(mappedScores);
    setIsEditMode(true);
  } catch (error) {
    setErrorMsg("Failed to fetch students or scores.");
    setStudentsScores([]);
    setIsEditMode(false);
    console.error(error);
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
      // Prepare payload - adjust to your API needs
      const payload = {
  teacher_id: null, // or valid teacher ID
  term_id: selectedTerm,
  class_id: selectedClass,
  session_id: selectedSession,
  scores: studentsScores.map(({ regNo, ca1, ca2, exam, subject_id }) => ({
    student_regNumber: regNo,  // ✅ must match backend field
    subject_id,
    ca1,
    ca2,
    exam,
  })),
};


console.log("Payload being sent:", payload);
      const res = await fetch("http://localhost/sfgs_api/api/scores.php", {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save scores");
      }

      setSuccessMsg("Scores saved successfully!");
    } catch (error) {
      setErrorMsg(error.message);
      console.error(error);
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
          onClassChange={(val) => {
            setSelectedClass(val);
            setSelectedSubject(""); // reset subject when class changes
          }}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedTerm={selectedTerm}
          onTermChange={setSelectedTerm}
          selectedSession={selectedSession}
          onSessionChange={setSelectedSession}
          
        />

        {loading && <Spinner />}

        {!loading && studentsScores.length > 0 && (
          <>
            {isMobile ? (
  <ScoreInputCardList
    studentsScores={studentsScores}  // <--- fix here
    onScoreChange={handleScoreChange}
  />
) : (
  <ScoreInputTable
     studentsScores={studentsScores}   // check if this prop name is correct for ScoreInputTable
    onScoreChange={handleScoreChange}
  />
)}


            <SubmitScoresButton
  onClick={handleSave}  // ✅ correctly triggers the function
  isLoading={saving}    // ✅ shows spinner when saving
  disabled={saving}
/>

          </>
        )}

        {errorMsg && (
          <ResultToast
            type="error"
            message={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
        {successMsg && (
          <ResultToast
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UploadPage;
