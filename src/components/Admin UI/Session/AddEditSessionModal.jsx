// src/components/AddEditSessionModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

export default function AddEditSessionModal({
  isOpen,
  onClose,
  onSave,
  editingSession,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    // Ensure name is always a string to avoid uncontrolled input warning
    setName(editingSession?.name || "");
  }, [editingSession]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sessionData = {
      id: editingSession ? editingSession.id : Date.now(),
      name: name.trim(),
    };

    onSave(sessionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white dark:bg-gray-800 p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              {editingSession ? "Edit Session" : "Add Session"}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Session Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 2024/2025"
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-700 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingSession ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
