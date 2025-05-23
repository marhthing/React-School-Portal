import React, { useState } from "react";
import TeacherModal from "./TeacherModal";

const EditTeacherButton = ({ teacher, onTeacherUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmit = (updatedTeacherData) => {
    if (onTeacherUpdated) {
      onTeacherUpdated(updatedTeacherData);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-indigo-600 hover:text-indigo-900 px-2"
        aria-label={`Edit teacher ${teacher.fullName}`}
      >
        Edit
      </button>

      {isOpen && (
        <TeacherModal
          mode="edit"
          teacherData={teacher}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default EditTeacherButton;
