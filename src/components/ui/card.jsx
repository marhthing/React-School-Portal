// src/components/ui/card.jsx

import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-sm text-gray-700 dark:text-gray-200 ${className}`}>{children}</div>;
}
