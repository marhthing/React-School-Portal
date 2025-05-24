// src/components/ResultToast.jsx
import React, { useEffect } from "react";

const ResultToast = ({ type = "success", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-600" : "bg-gray-500";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-xs px-4 py-3 rounded shadow-lg text-white flex items-center space-x-3 ${bgColor}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="flex-grow">{message}</span>
      <button
        onClick={onClose}
        className="font-bold hover:underline focus:outline-none"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default ResultToast;
