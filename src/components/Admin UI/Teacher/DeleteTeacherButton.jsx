import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const DeleteTeacherButton = ({ teacher, onDelete }) => {
  if (!teacher) return null;
  return (
    <button
      onClick={() => onDelete(teacher.id)}
      title={`Delete ${teacher.fullName}`}
      className="text-red-600 hover:text-red-800"
      aria-label={`Delete teacher ${teacher.fullName}`}
      type="button"
    >
      <FaTrashAlt />
    </button>
  );
};

export default DeleteTeacherButton;
