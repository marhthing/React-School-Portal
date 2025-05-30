import React, { useState, useEffect } from "react";
import RegisterControls from "../../components/Admin UI/Register/RegisterControls";
import StudentList from "../../components/Admin UI/Register/StudentList";
import Notification from "../../components/Admin UI/Register/Notification";
import SubjectModal from "../../components/Admin UI/Register/SubjectModal";
import AdminLayout from '../../components/AdminLayout';

export default function StudentRegisterPage() {
  // State
  const [term, setTerm] = useState(null);
  const [session, setSession] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  // Selected student & their subjects
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const [showSubjectModal, setShowSubjectModal] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);

        const [termRes, sessionRes, classesRes] = await Promise.all([
          fetch("http://localhost/sfgs_api/api/current-term.php"),
          fetch("http://localhost/sfgs_api/api/current-session.php"),
          fetch("http://localhost/sfgs_api/api/classes.php"),
        ]);

        if (!termRes.ok || !sessionRes.ok || !classesRes.ok) {
          throw new Error("Failed to load initial data");
        }

        const termData = await termRes.json();
        if (termData.error) {
          setTerm(null);
          setNotification({ type: "error", message: termData.error });
        } else {
          setTerm(termData);
        }

        const sessionData = await sessionRes.json();
        setSession(sessionData);

        const classesData = await classesRes.json();
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0]);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        setNotification({ type: "error", message: error.message || "Error loading initial data" });
      }
    }

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedClass || !term || !session) {
      setStudents([]);
      return;
    }

    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost/sfgs_api/api/get_students.php?classId=${selectedClass.id}&termId=${term.id}&sessionId=${session.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();

        setStudents(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setNotification({ type: "error", message: error.message || "Error fetching students" });
      }
    }

    fetchStudents();
  }, [selectedClass, term, session]);

  function handleToggleStudent(studentId) {
    setSelectedStudents((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(studentId)) {
        newSelected.delete(studentId);
      } else {
        newSelected.add(studentId);
      }
      return newSelected;
    });
  }

async function fetchStudentSubjects(regNo) {
  if (!selectedClass || !term || !session) {
    setNotification({ type: "error", message: "Please select a class, term, and session" });
    return;
  }

  try {
    setLoadingSubjects(true);
    setNotification(null);

    const res = await fetch(
      `http://localhost/sfgs_api/api/get_student_subjects.php?reg_no=${encodeURIComponent(
        regNo
      )}&classId=${selectedClass.id}&termId=${term.id}&sessionId=${session.id}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch student subjects");
    }

    const data = await res.json();

    // `registered: true` means active = 1 in DB
    setStudentSubjects(data);
  } catch (error) {
    setNotification({ type: "error", message: error.message || "Error fetching student subjects" });
  } finally {
    setLoadingSubjects(false);
  }
}


  function handleSelectStudent(student) {
    setSelectedStudent(student);
    fetchStudentSubjects(student.reg_no);
  }

  async function handleRegisterAll() {
    if (!selectedClass || !term || !session) {
      setNotification({ type: "error", message: "Please select a class, term, and session" });
      return;
    }

    try {
      setLoading(true);
      setNotification(null);

      const res = await fetch("http://localhost/sfgs_api/api/registerderegister-all.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass.id,
          termId: term.id,
          sessionId: session.id,
          action: "register",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Registration failed");
      }

      setNotification({ type: "success", message: "All students registered successfully." });

      // Refresh students
      const studentsRes = await fetch(
        `http://localhost/sfgs_api/api/get_students.php?classId=${selectedClass.id}&termId=${term.id}&sessionId=${session.id}`
      );
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNotification({ type: "error", message: error.message || "Registration failed." });
    }
  }

  async function handleDeregisterAll() {
    if (!selectedClass || !term || !session) {
      setNotification({ type: "error", message: "Please select a class, term, and session" });
      return;
    }

    try {
      setLoading(true);
      setNotification(null);

      const res = await fetch("http://localhost/sfgs_api/api/registerderegister-all.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: selectedClass.id,
          termId: term.id,
          sessionId: session.id,
          action: "deregister",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Deregistration failed");
      }

      setNotification({ type: "success", message: "All students deregistered successfully." });

      // Refresh students
      const studentsRes = await fetch(
        `http://localhost/sfgs_api/api/get_students.php?classId=${selectedClass.id}&termId=${term.id}&sessionId=${session.id}`
      );
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNotification({ type: "error", message: error.message || "Deregistration failed." });
    }
  }

  function handleOpenSubjectModal(student) {
    setSelectedStudent(student);
    fetchStudentSubjects(student.reg_no);
    setShowSubjectModal(true);
  }

  function handleCloseSubjectModal() {
    setShowSubjectModal(false);
    setSelectedStudent(null);
    setStudentSubjects([]);
  }

  function handleToggleSubject(subjectId) {
    setStudentSubjects((prev) =>
      prev.map((subj) =>
        subj.subject_id === subjectId
          ? { ...subj, registered: !subj.registered }
          : subj
      )
    );
  }

async function handleUpdateStudentSubjects(updatedSubjects) {
  if (!selectedStudent || !term || !session || !selectedClass) {
    setNotification({ type: "error", message: "Missing data to update subjects" });
    return;
  }

  try {
    setLoadingSubjects(true);

    const res = await fetch("http://localhost/sfgs_api/api/update_student_subjects.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
    reg_no: selectedStudent.reg_no,
    classId: selectedClass.id,
    termId: term.id,
    sessionId: session.id,
    subjects: updatedSubjects.map(subj => ({
      subject_id: subj.subject_id,
      registered: subj.registered,
    })),
  }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to update subjects");
    }

    setNotification({ type: "success", message: "Subjects updated successfully" });
    handleCloseSubjectModal();

  } catch (error) {
    setNotification({ type: "error", message: error.message || "Error updating subjects" });
  } finally {
    setLoadingSubjects(false);
  }
}

  return (
  <AdminLayout>
    <div className="p-6 mt-20 max-w-7xl mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">
        Student Subject Registration
      </h1>

      {/* Controls card */}
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6 mb-6">
        <RegisterControls
          term={term}
          session={session}
          classes={classes}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          onRegisterAll={handleRegisterAll}
          onDeregisterAll={handleDeregisterAll}
          loading={loading}
        />
      </section>

      {/* Notification */}
      {notification && (
        <div className="mb-6">
          <Notification type={notification.type} message={notification.message} />
        </div>
      )}

      {/* Student list */}
      <section className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
        <StudentList
          students={students}
          selectedClass={selectedClass}
          selectedStudents={selectedStudents}
          onToggleStudent={handleToggleStudent}
          loading={loading}
          onSelectStudent={handleSelectStudent}
          onViewSubjects={handleOpenSubjectModal}
        />
      </section>

      {/* Subject modal */}
      {showSubjectModal && (
        <SubjectModal
          onClose={handleCloseSubjectModal}
          student={selectedStudent}
          allSubjects={studentSubjects}
          loading={loadingSubjects}
          onToggleSubject={handleToggleSubject}
          onSubmit={handleUpdateStudentSubjects}
          actionLoading={loadingSubjects}
        />
      )}
    </div>
  </AdminLayout>
);

}
