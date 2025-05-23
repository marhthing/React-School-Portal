import React, { useState } from "react";
import TeacherModal from "./TeacherModal";

const AddTeacherButton = ({ onTeacherAdded }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (newTeacherData) => {
    // Call parent callback if provided
    if (onTeacherAdded) {
      onTeacherAdded(newTeacherData);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm"
      >
        Register New Teacher
      </button>

      {isOpen && (
        <TeacherModal
          mode="create"
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default AddTeacherButton;
