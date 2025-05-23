import React, { useState } from "react";

const CLASS_OPTIONS = [
  "",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
];

const StudentSearchFilter = ({ onFilterChange }) => {
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [regNumber, setRegNumber] = useState("");

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    onFilterChange({ name: value, className, regNumber });
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setClassName(value);
    onFilterChange({ name, className: value, regNumber });
  };

  const handleRegNumberChange = (e) => {
    const value = e.target.value;
    setRegNumber(value);
    onFilterChange({ name, className, regNumber: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4 items-center justify-between">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
        className="px-3 py-2 border rounded-md w-full sm:w-1/3 dark:bg-gray-700 dark:text-white"
      />
      <input
        type="text"
        placeholder="Reg No."
        value={regNumber}
        onChange={handleRegNumberChange}
        className="px-3 py-2 border rounded-md w-full sm:w-1/3 dark:bg-gray-700 dark:text-white"
      />
      <select
        value={className}
        onChange={handleClassChange}
        className="px-3 py-2 border rounded-md w-full sm:w-1/3 dark:bg-gray-700 dark:text-white"
      >
        {CLASS_OPTIONS.map((cls) => (
          <option key={cls} value={cls}>
            {cls === "" ? "Filter by class" : cls}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSearchFilter;
