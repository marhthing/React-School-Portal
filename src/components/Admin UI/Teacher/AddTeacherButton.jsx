import React, { useState } from "react";

const AddTeacherButton = ({ onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return; // prevent double clicks
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm flex items-center justify-center ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      Register New Teacher
    </button>
  );
};

export default AddTeacherButton;
