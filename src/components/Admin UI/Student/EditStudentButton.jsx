import React, { useState } from "react";
import StudentModal from "./StudentModal";

const EditStudentButton = ({ student, onStudentUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (updatedStudentData) => {
    // Here you can send updatedStudentData to your API/backend or update state
    if (onStudentUpdated) {
      onStudentUpdated(updatedStudentData);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-indigo-600 hover:text-indigo-900 px-2"
        aria-label={`Edit student ${student.fullName}`}
      >
        Edit
      </button>

      {isOpen && (
        <StudentModal
          mode="edit"
          studentData={student}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default EditStudentButton;
