// src/pages/SessionPage.jsx
import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import SessionsTable from "../../components/Admin UI/Session/SessionsTable";
import ClassesTable from "../../components/Admin UI/Session/ClassesTable";
import AddEditSessionModal from "../../components/Admin UI/Session/AddEditSessionModal";
import AddEditClassModal from "../../components/Admin UI/Session/AddEditClassModal";
import ConfirmDeleteModal from "../../components/Admin UI/Session/ConfirmDeleteModal";
export default function SessionPage() {
  const [sessions, setSessions] = useState([
    { id: 1, name: "2023/2024" },
    { id: 2, name: "2024/2025" },
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: "JSS1" },
    { id: 2, name: "JSS2" },
    { id: 3, name: "JSS3" },
    { id: 4, name: "SSS1" },
    { id: 5, name: "SSS2A", category: "Science" },
    { id: 6, name: "SSS2B", category: "Art" },
    { id: 7, name: "SSS3A", category: "Science" },
    { id: 8, name: "SSS3B", category: "Art" },
  ]);

  const [editingSession, setEditingSession] = useState(null);
  const [editingClass, setEditingClass] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null); // { type: 'session' | 'class', item }

  const handleSaveSession = (session) => {
    if (session.id) {
      setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
    } else {
      setSessions((prev) => [...prev, { ...session, id: Date.now() }]);
    }
    setEditingSession(null);
  };

  const handleSaveClass = (cls) => {
    if (cls.id) {
      setClasses((prev) => prev.map((c) => (c.id === cls.id ? cls : c)));
    } else {
      setClasses((prev) => [...prev, { ...cls, id: Date.now() }]);
    }
    setEditingClass(null);
  };

  const handleConfirmDelete = () => {
    if (deletingItem?.type === "session") {
      setSessions((prev) => prev.filter((s) => s.id !== deletingItem.item.id));
    } else if (deletingItem?.type === "class") {
      setClasses((prev) => prev.filter((c) => c.id !== deletingItem.item.id));
    }
    setDeletingItem(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-10 p-4 mt-20">
        <h1 className="text-3xl font-bold">Session Management</h1>

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
              onDelete={(s) => setDeletingItem({ type: "session", item: s })}
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
              onDelete={(cls) => setDeletingItem({ type: "class", item: cls })}
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

      </div>
    </AdminLayout>
  );
}
