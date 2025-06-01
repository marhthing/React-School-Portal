import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from '../../components/ui/AdminLayout';

import ResultCalculationForm from "../../components/Admin UI/Publish/ResultCalculationForm";
import ResultVisibilityControl from "../../components/Admin UI/Publish/ResultVisibilityControl";
import TermDateSetter from "../../components/Admin UI/Publish/TermDateSetter";

const ResultPublishPage = () => {
  // Result Calculation States
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcMessage, setCalcMessage] = useState(null);

  // Result Visibility States
  const [visibilitySettings, setVisibilitySettings] = useState({
    classes: [],
    students: [],
  });
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState(null);
  const [students, setStudents] = useState([]);

  // Term Dates States
  const [termDates, setTermDates] = useState({
    endOfTerm: "",
    nextTermStart: "",
  });
  const [termDatesLoading, setTermDatesLoading] = useState(false);
  const [termDatesMessage, setTermDatesMessage] = useState(null);

  // Fetch students with results when term/session changes
  const fetchStudentsWithResults = async (termName, sessionId) => {
    if (!termName || !sessionId) return;

    try {
      const response = await axios.get(
        "http://localhost/sfgs_api/api/result_students.php",
        {
          params: { term: termName, session_id: sessionId },
        }
      );

      if (response.data.success) {
        console.log("Fetched students:", response.data.students);
        setStudents(response.data.students || []);
      } else {
        console.error("Failed to fetch students:", response.data.error);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students with results:", error);
      setStudents([]);
    }
  };

  // Fetch visibility settings for current term/session
  const fetchVisibilityForTermSession = async (termName, sessionId) => {
    if (!termName || !sessionId) return;

    try {
      const res = await axios.get(
        "http://localhost/sfgs_api/api/result_visibility.php"
      );

      // Filter visibility data for current term/session
      const currentClassVisibility = (res.data?.class_visibility || [])
        .filter(
          (item) =>
            item.term_name === termName &&
            item.session_id == sessionId &&
            item.visible === 1
        )
        .map((item) => String(item.class_id));

      const currentStudentVisibility = (res.data?.student_visibility || [])
        .filter(
          (item) =>
            item.term_name === termName &&
            item.session_id == sessionId &&
            item.visible === 1
        )
        .map((item) => item.student_regNumber);

      setVisibilitySettings({
        classes: currentClassVisibility,
        students: currentStudentVisibility,
      });
    } catch (error) {
      console.error("Visibility fetch failed:", error);
      setVisibilitySettings({ classes: [], students: [] });
    }
  };

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [clsRes, termRes, sesRes] = await Promise.all([
          axios.get("http://localhost/sfgs_api/api/classes.php"),
          axios.get("http://localhost/sfgs_api/api/terms.php"),
          axios.get("http://localhost/sfgs_api/api/sessions.php"),
        ]);

        setClasses(clsRes.data || []);
        setTerms(termRes.data || []);
        setSessions(sesRes.data || []);

        // Set initial selections
        const initialClass = clsRes.data?.length ? clsRes.data[0].id : "";
        const initialTerm = termRes.data?.length ? termRes.data[0].name : "";
        const initialSession = sesRes.data?.length ? sesRes.data[0].id : "";

        setSelectedClass(initialClass);
        setSelectedTerm(initialTerm);
        setSelectedSession(initialSession);

        // Fetch students and visibility for initial term/session
        if (initialTerm && initialSession) {
          fetchStudentsWithResults(initialTerm, initialSession);
          fetchVisibilityForTermSession(initialTerm, initialSession);
        }
      } catch (error) {
        console.error("Dropdown fetch failed:", error);
      }
    };

    const fetchTermDates = async () => {
      setTermDatesLoading(true);
      try {
        const res = await axios.get(
          "http://localhost/sfgs_api/api/term_dates.php"
        );
        setTermDates({
          endOfTerm: res.data?.endOfTerm || "",
          nextTermStart: res.data?.nextTermStart || "",
        });
      } catch (error) {
        console.error("Term dates fetch failed:", error);
      } finally {
        setTermDatesLoading(false);
      }
    };

    fetchDropdownData();
    fetchTermDates();
  }, []);

  // Fetch students and visibility when term or session changes
  useEffect(() => {
    if (selectedTerm && selectedSession) {
      fetchStudentsWithResults(selectedTerm, selectedSession);
      fetchVisibilityForTermSession(selectedTerm, selectedSession);
    }
  }, [selectedTerm, selectedSession]);

  const handleCalculateResults = async () => {
    setCalcLoading(true);
    setCalcMessage(null);
    try {
      const res = await axios.post(
        "http://localhost/sfgs_api/api/publish_result.php",
        {
          class_id: selectedClass,
          term: selectedTerm,
          session_id: selectedSession,
        }
      );
      setCalcMessage({
        type: "success",
        text: res.data.message || "Results calculated successfully.",
      });
    } catch (error) {
      console.error("API Error:", error.response || error);
      setCalcMessage({
        type: "error",
        text: error.response?.data?.message || "Calculation failed.",
      });
    } finally {
      setCalcLoading(false);
    }
  };

  const onToggleClassVisibility = (classId) => {
    setVisibilitySettings((prev) => {
      const classes = prev.classes || [];
      const newClasses = classes.includes(classId)
        ? classes.filter((id) => id !== classId)
        : [...classes, classId];
      return { ...prev, classes: newClasses };
    });
  };

  const onToggleStudentVisibility = (studentId) => {
    setVisibilitySettings((prev) => {
      const students = prev.students || [];
      const newStudents = students.includes(studentId)
        ? students.filter((id) => id !== studentId)
        : [...students, studentId];
      return { ...prev, students: newStudents };
    });
  };

  const buildPayload = async () => {
    const { classes: visibleClassIds = [], students: visibleStudentIds = [] } =
      visibilitySettings;

    console.log("Building payload with:");
    console.log("- visibleStudentIds:", visibleStudentIds);
    console.log("- selectedTerm:", selectedTerm);
    console.log("- selectedSession:", selectedSession);

    // Build class visibility array
    const class_visibility = classes.map(({ id }) => ({
      class_id: Number(id),
      term: selectedTerm,
      session_id: Number(selectedSession),
      visible: visibleClassIds.includes(String(id)) ? 1 : 0,
    }));

    // Fetch ALL students for this term/session to build complete visibility array
    let all_students = [];
    try {
      const response = await axios.get(
        "http://localhost/sfgs_api/api/result_students.php",
        {
          params: { term: selectedTerm, session_id: selectedSession },
        }
      );

      if (response.data.success) {
        all_students = response.data.students || [];
      }
    } catch (error) {
      console.error("Error fetching all students:", error);
    }

    // Build student visibility array for ALL students
    const student_visibility = all_students.map((student) => {
      const regNumber = student.regNumber || student.student_regNumber;
      return {
        student_regNumber: regNumber,
        term: selectedTerm,
        session_id: Number(selectedSession),
        visible: visibleStudentIds.includes(regNumber) ? 1 : 0,
      };
    });

    console.log("Generated student_visibility:", student_visibility);

    return { class_visibility, student_visibility };
  };

  const onSaveVisibility = async () => {
    setVisibilityLoading(true);
    setVisibilityMessage(null);

    try {
      const payload = await buildPayload();
      console.log("Sending visibility settings to API:", payload);

      const res = await axios.post(
        "http://localhost/sfgs_api/api/result_visibility.php",
        payload
      );

      if (res.data.success) {
        // Update local state based on response
        const updatedClasses = (res.data.processed_classes || [])
          .filter((v) => v.visible === 1)
          .map((v) => String(v.class_id));

        const updatedStudents = (res.data.processed_students || [])
          .filter((v) => v.visible === 1)
          .map((v) => v.student_regNumber);

        setVisibilitySettings({
          classes: updatedClasses,
          students: updatedStudents,
        });

        setVisibilityMessage({
          type: "success",
          text: res.data.message || "Visibility updated successfully.",
        });
      } else {
        setVisibilityMessage({
          type: "error",
          text: res.data.message || "Failed to update visibility.",
        });
      }
    } catch (error) {
      console.error("Visibility save error:", error);
      setVisibilityMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update visibility.",
      });
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Term Dates change handlers
  const onEndOfTermChange = (date) => {
    setTermDates((prev) => ({ ...prev, endOfTerm: date }));
  };

  const onNextTermStartChange = (date) => {
    setTermDates((prev) => ({ ...prev, nextTermStart: date }));
  };

  const onSaveTermDates = async () => {
    setTermDatesLoading(true);
    setTermDatesMessage(null);
    try {
      const res = await axios.post(
        "http://localhost/sfgs_api/api/term_dates.php",
        termDates
      );
      setTermDates({
        endOfTerm: res.data?.endOfTerm || "",
        nextTermStart: res.data?.nextTermStart || "",
      });
      setTermDatesMessage({ type: "success", text: "Term dates saved." });
    } catch (error) {
      setTermDatesMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to save term dates.",
      });
    } finally {
      setTermDatesLoading(false);
    }
  };

  const handleTermSessionChange = ({ termName, sessionId }) => {
    setSelectedTerm(termName);
    setSelectedSession(sessionId);
    // Students and visibility will be fetched automatically via useEffect
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 mt-20 space-y-10">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
          Result Publish Management
        </h1>

        {/* Result Calculation */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <ResultCalculationForm
            classes={classes}
            terms={terms}
            sessions={sessions}
            selectedClass={selectedClass}
            selectedTerm={selectedTerm}
            selectedSession={selectedSession}
            onClassChange={setSelectedClass}
            onTermChange={setSelectedTerm}
            onSessionChange={setSelectedSession}
            onCalculate={handleCalculateResults}
            loading={calcLoading}
            message={calcMessage}
          />
        </div>

        {/* Visibility and Term Dates */}
        <div className="grid md:grid-cols-2 gap-6">
          <ResultVisibilityControl
            classes={classes}
            students={students}
            terms={terms}
            sessions={sessions}
            initialTermName={selectedTerm}
            initialSessionId={selectedSession}
            visibilitySettings={visibilitySettings}
            onToggleClassVisibility={onToggleClassVisibility}
            onToggleStudentVisibility={onToggleStudentVisibility}
            onTermSessionChange={handleTermSessionChange}
            onSaveVisibility={onSaveVisibility}
            saving={visibilityLoading}
            message={visibilityMessage}
          />

          <TermDateSetter
            endOfTerm={termDates.endOfTerm}
            nextTermStart={termDates.nextTermStart}
            onEndOfTermChange={onEndOfTermChange}
            onNextTermStartChange={onNextTermStartChange}
            onSaveDates={onSaveTermDates}
            saving={termDatesLoading}
            message={termDatesMessage}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ResultPublishPage;
