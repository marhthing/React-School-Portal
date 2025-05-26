import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

const DeleteStudentButton = ({ student, onDelete }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(student.regNumber); // or pass student if needed
    }
    closeConfirm();
  };

  return (
    <>
      <button
        onClick={openConfirm}
        title={`Delete ${student.fullName}`}
        className="text-red-600 hover:text-red-800"
        aria-label={`Delete student ${student.fullName}`}
      >
        <FaTrash />
      </button>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded p-6 w-80 max-w-full shadow-lg">
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100"
            >
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete student{" "}
              <strong>{student.fullName}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteStudentButton;
