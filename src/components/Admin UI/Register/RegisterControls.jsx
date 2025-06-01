import React from "react";
import Spinner from '../../ui/Spinner'

export default function RegisterControls({
  term,
  session,
  classes,
  selectedClass,
  onClassChange,
  onRegisterAll,
  onDeregisterAll,
  loading,
}) {
  const isActionDisabled = loading || !selectedClass || !term || !session;

  // Shared classes for inputs/selects with dark mode support
  const inputBaseClasses =
    "mt-1 block w-48 rounded-md border shadow-sm sm:text-sm focus:outline-none " +
    "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 " +
    "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100";

  const disabledInputClasses =
    "cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400";

  return (
    <div className="mb-6 flex flex-wrap items-center gap-6">
      {/* Term */}
      <div>
        <label
          htmlFor="term"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Current Term
        </label>
        <input
          id="term"
          type="text"
          value={term ? term.name : "Not set"}
          readOnly
          className={`${inputBaseClasses} ${
            true ? disabledInputClasses : ""
          }`}
        />
      </div>

      {/* Session */}
      <div>
        <label
          htmlFor="session"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Current Session
        </label>
        <input
          id="session"
          type="text"
          value={session ? session.name : "Not set"}
          readOnly
          className={`${inputBaseClasses} ${disabledInputClasses}`}
        />
      </div>

      {/* Class Select */}
      <div>
        <label
          htmlFor="class-select"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Select Class
        </label>
        <select
          id="class-select"
          value={selectedClass ? selectedClass.id : ""}
          onChange={(e) => {
            const classId = e.target.value;
            const selected = classes.find(
              (c) => c.id.toString() === classId
            );
            onClassChange(selected || null);
          }}
          disabled={loading || classes.length === 0}
          className={`${inputBaseClasses} ${
            loading || classes.length === 0 ? disabledInputClasses : ""
          }`}
        >
          {classes.length === 0 ? (
            <option value="">No classes available</option>
          ) : (
            classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}{" "}
                {cls.stream && cls.stream !== "None"
                  ? `(${cls.stream})`
                  : ""}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Buttons */}
      <div className="self-end flex flex-wrap gap-2">
        <button
          onClick={onRegisterAll}
          disabled={isActionDisabled}
          title={
            isActionDisabled
              ? !term
                ? "No active term selected"
                : !session
                ? "No active session selected"
                : !selectedClass
                ? "No class selected"
                : "Loading..."
              : ""
          }
          type="button"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${
            isActionDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? (
  <>
    <Spinner /> Processing...
  </>
) : (
  "Register All Students"
)}

        </button>

        <button
          onClick={onDeregisterAll}
          disabled={isActionDisabled}
          title={
            isActionDisabled
              ? !term
                ? "No active term selected"
                : !session
                ? "No active session selected"
                : !selectedClass
                ? "No class selected"
                : "Loading..."
              : ""
          }
          type="button"
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
          ${
            isActionDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? (
  <>
    <Spinner /> Processing...
  </>
) : (
  "DeRegister All Students"
)}

        </button>
      </div>
    </div>
  );
}
