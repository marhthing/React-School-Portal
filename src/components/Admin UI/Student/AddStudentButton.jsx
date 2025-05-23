import React, { useState } from "react";
import StudentModal from "./StudentModal";

const AddStudentButton = ({ onStudentAdded }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (newStudentData) => {
    // Here you can send newStudentData to your API/backend or state manager
    // For now, just call parent callback if provided
    if (onStudentAdded) {
      onStudentAdded(newStudentData);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm"
      >
        Register New Student
      </button>

      {isOpen && (
        <StudentModal
          mode="create"
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default AddStudentButton;
