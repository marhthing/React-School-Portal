import React from "react";

const AddStudentButton = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm"
    >
      Register New Student
    </button>
  );
};

export default AddStudentButton;
