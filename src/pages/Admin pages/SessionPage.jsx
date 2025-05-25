import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import SessionsTable from "../../components/Admin UI/Session/SessionsTable";
import ClassesTable from "../../components/Admin UI/Session/ClassesTable";
import AddEditSessionModal from "../../components/Admin UI/Session/AddEditSessionModal";
import AddEditClassModal from "../../components/Admin UI/Session/AddEditClassModal";
import ConfirmDeleteModal from "../../components/Admin UI/Session/ConfirmDeleteModal";
import Spinner from "../../components/Spinner"; // adjust the import path if needed

export default function SessionPage() {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch sessions and classes from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsRes, classesRes] = await Promise.all([
          axios.get("http://localhost/sfgs_api/api/sessions.php"),
          axios.get("http://localhost/sfgs_api/api/classes.php"),
        ]);
        setSessions(sessionsRes.data);
        setClasses(classesRes.data);
      } catch (error) {
        console.error("Failed to fetch sessions/classes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save session (create or update)
  const handleSaveSession = async (session) => {
    try {
      if (session.id) {
        // Update existing session
        const res = await axios.put(
          `http://localhost/sfgs_api/api/sessions.php?id=${session.id}`,
          session
        );

        setSessions((prev) =>
          prev.map((s) => (s.id === session.id ? res.data : s))
        );
      } else {
        // Create new session
        const { id, ...newSession } = session;
        const res = await axios.post(
          "http://localhost/sfgs_api/api/sessions.php",
          newSession
        );

        // Handle possible array response
        let createdSession = Array.isArray(res.data) ? res.data[0] : res.data;
        const sessionId = Number(createdSession?.id);

        if (sessionId && sessionId > 0) {
          setSessions((prev) => [...prev, createdSession]);
        } else {
          // fallback: refetch full sessions list
          const sessionsRes = await axios.get(
            "http://localhost/sfgs_api/api/sessions.php"
          );
          setSessions(sessionsRes.data);
        }
      }
      setEditingSession(null);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  // Save class (create or update)
  const handleSaveClass = async (cls) => {
    try {
      if (cls.id) {
        const res = await axios.put(
          `http://localhost/sfgs_api/api/classes.php?id=${cls.id}`,
          cls
        );

        setClasses((prev) =>
          prev.map((c) => (c.id === cls.id ? res.data : c))
        );
      } else {
        const { id, ...newClass } = cls;
        const res = await axios.post(
          "http://localhost/sfgs_api/api/classes.php",
          newClass
        );

        // Handle possible array response
        let createdClass = Array.isArray(res.data) ? res.data[0] : res.data;
        const classId = Number(createdClass?.id);

        if (classId && classId > 0) {
          setClasses((prev) => [...prev, createdClass]);
        } else {
          // fallback: refetch full classes list
          const classesRes = await axios.get(
            "http://localhost/sfgs_api/api/classes.php"
          );
          setClasses(classesRes.data);
        }
      }
      setEditingClass(null);
    } catch (error) {
      console.error("Error saving class:", error);
    }
  };

  // Delete session or class
  const handleConfirmDelete = async () => {
    try {
      if (deletingItem?.type === "session") {
        await axios.delete(
          `http://localhost/sfgs_api/api/sessions.php?id=${deletingItem.item.id}`
        );
        setSessions((prev) =>
          prev.filter((s) => s.id !== deletingItem.item.id)
        );
      } else if (deletingItem?.type === "class") {
        await axios.delete(
          `http://localhost/sfgs_api/api/classes.php?id=${deletingItem.item.id}`
        );
        setClasses((prev) =>
          prev.filter((c) => c.id !== deletingItem.item.id)
        );
      }
      setDeletingItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 p-4 mt-20">
        <h1 className="text-3xl font-bold">Session Management</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Sessions Section */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold">Academic Sessions</h2>
                <button
                  onClick={() => setEditingSession({})}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Session
                </button>
              </div>
              <div className="w-full overflow-x-auto rounded-lg shadow-sm">
                <SessionsTable
                  sessions={sessions}
                  onEdit={(s) => setEditingSession(s)}
                  onDelete={(s) =>
                    setDeletingItem({ type: "session", item: s })
                  }
                />
              </div>
            </section>

            {/* Classes Section */}
            <section>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold">Classes</h2>
                <button
                  onClick={() => setEditingClass({})}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Class
                </button>
              </div>
              <div className="w-full overflow-x-auto rounded-lg shadow-sm">
                <ClassesTable
                  classes={classes}
                  onEdit={(cls) => setEditingClass(cls)}
                  onDelete={(cls) =>
                    setDeletingItem({ type: "class", item: cls })
                  }
                />
              </div>
            </section>

            {/* Modals */}
            {editingSession && (
              <AddEditSessionModal
                isOpen={Boolean(editingSession)}
                editingSession={editingSession}
                onClose={() => setEditingSession(null)}
                onSave={handleSaveSession}
              />
            )}

            {editingClass && (
              <AddEditClassModal
                isOpen={Boolean(editingClass)}
                editingClass={editingClass}
                onClose={() => setEditingClass(null)}
                onSave={handleSaveClass}
              />
            )}

            {deletingItem && (
              <ConfirmDeleteModal
                isOpen={Boolean(deletingItem)}
                onClose={() => setDeletingItem(null)}
                onConfirm={handleConfirmDelete}
                itemName={deletingItem.item.name}
              />
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
