import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

export default function AddEditClassModal({
  isOpen = false,  // default false to avoid undefined
  onClose,
  onSave,
  editingClass,
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingClass) {
      setName(editingClass.name || "");
      setCategory(editingClass.category || "");
    } else {
      setName("");
      setCategory("");
    }
  }, [editingClass]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newClass = {
      id: editingClass ? editingClass.id : Date.now(),
      name: name.trim(),
      category: category.trim() || null,
    };

    onSave(newClass);
    onClose();
  };

  return (
    <Dialog open={Boolean(isOpen)} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
          <Dialog.Title className="text-xl font-semibold">
            {editingClass ? "Edit Class" : "Add New Class"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category (Optional for SSS classes only)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">— None —</option>
                <option value="Science">Science</option>
                <option value="Art">Art</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingClass ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
