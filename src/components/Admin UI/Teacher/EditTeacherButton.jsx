import React from "react";

const EditTeacherButton = ({ teacher, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-indigo-600 hover:text-indigo-900 px-2"
      aria-label={`Edit teacher ${teacher.fullName}`}
    >
      Edit
    </button>
  );
};

export default EditTeacherButton;
