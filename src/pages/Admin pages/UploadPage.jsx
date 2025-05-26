import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

import ResultFormFilter from "../../components/Admin UI/Upload/ResultFormFilter";
import ScoreInputTable from "../../components/Admin UI/Upload/ScoreInputTable";
import ScoreInputCardList from "../../components/Admin UI/Upload/ScoreInputCardList";
import SubmitScoresButton from "../../components/Admin UI/Upload/SubmitScoresButton";
import ResultToast from "../../components/Admin UI/Upload/ResultToast";
import Spinner from "../../components/Spinner";

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
    const classId = selectedClass; // from classesList id
    const sessionId = selectedSession; // from sessionsList id
    const subjectId = selectedSubject; // from subjectsList id

    const url = new URL("http://localhost/sfgs_api/api/scores.php");
    url.searchParams.append("classId", classId);
    url.searchParams.append("subjectId", subjectId);
    url.searchParams.append("term", selectedTerm);
    url.searchParams.append("sessionId", sessionId);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch scores");

    const data = await res.json();

    // data is an object with 'scores' array inside
    const scoresArray = Array.isArray(data.scores) ? data.scores : [];

    const scoresData = scoresArray.map((item) => ({
      // Adjust field names based on your API response:
      id: item.id || item.student_regNumber || "", // score ID or student reg number
      name: item.student_name || "",               // You may want to fetch student name separately if missing
      regNo: item.student_regNumber || "",
      ca1: item.ca1 ?? "",
      ca2: item.ca2 ?? "",
      exam: item.exam ?? "",
      total: ((item.ca1 ?? 0) + (item.ca2 ?? 0) + (item.exam ?? 0)),
      errors: {},
    }));

    setStudentsScores(scoresData);
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
        classId: selectedClass,
        subjectId: selectedSubject,
        term: selectedTerm,
        sessionId: selectedSession,
        scores: studentsScores.map(({ id, ca1, ca2, exam }) => ({
          studentId: id,
          ca1,
          ca2,
          exam,
        })),
      };

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
                students={studentsScores}
                onScoreChange={handleScoreChange}
              />
            ) : (
              <ScoreInputTable
                students={studentsScores}
                onScoreChange={handleScoreChange}
              />
            )}

            <SubmitScoresButton
              onSave={handleSave}
              saving={saving}
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
