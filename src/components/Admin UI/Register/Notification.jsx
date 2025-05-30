import React, { useEffect, useState } from "react";

const typeStyles = {
  success: "bg-green-100 border-green-400 text-green-700",
  error: "bg-red-100 border-red-400 text-red-700",
  info: "bg-blue-100 border-blue-400 text-blue-700",
};

export default function Notification({
  type = "info",
  message,
  onClose,
  duration = 4000,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    // Start with visible = true to trigger fade-in
    setVisible(true);

    // After duration, fade out
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  // When fade-out finishes, call onClose to remove notification from DOM
  // We'll use transitionend event listener on the container

  function handleTransitionEnd() {
    if (!visible) {
      onClose?.();
    }
  }

  if (!message) return null;

  return (
    <div
      role="alert"
      className={`
        border-l-4 p-4 mb-4 rounded shadow-md 
        ${typeStyles[type] || typeStyles.info} 
        transition-opacity duration-500 ease-in-out
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{message}</p>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 text-lg font-bold leading-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Close notification"
          type="button"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
