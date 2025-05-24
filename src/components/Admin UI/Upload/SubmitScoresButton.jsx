// src/components/SubmitScoresButton.jsx
import React from "react";

const SubmitScoresButton = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`mt-6 w-full sm:w-auto px-6 py-3 font-semibold rounded 
        text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
        flex items-center justify-center space-x-2
      `}
      type="button"
    >
      {isLoading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      <span>{isLoading ? "Saving..." : "Save Scores"}</span>
    </button>
  );
};

export default SubmitScoresButton;
