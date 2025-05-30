import React, { useState } from "react";
import StudentModal from "./StudentModal";

const EditStudentButton = ({ student, onStudentUpdated, stateOptions, classOptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (updatedStudentData) => {
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
        aria-label={`Edit student ${student.regNumber}`}
      >
        Edit
      </button>

      {isOpen && (
        <StudentModal
          mode="edit"
          studentData={student}
          onSubmit={handleSubmit}
          onClose={handleClose}
          stateOptions={stateOptions} 
            classOptions={classOptions}
        />
      )}
    </>
  );
};

export default EditStudentButton;
