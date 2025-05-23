import React, { useState } from "react";

const ROLE_OPTIONS = [
  "",
  "Head Teacher",
  "Assistant Teacher",
  "Subject Teacher",
  "Administrator",
];

const TeacherSearchFilter = ({ onFilterChange }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    onFilterChange({ name: value, role, email });
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRole(value);
    onFilterChange({ name, role: value, email });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    onFilterChange({ name, role, email: value });
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
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
        className="px-3 py-2 border rounded-md w-full sm:w-1/3 dark:bg-gray-700 dark:text-white"
      />
      <select
        value={role}
        onChange={handleRoleChange}
        className="px-3 py-2 border rounded-md w-full sm:w-1/3 dark:bg-gray-700 dark:text-white"
      >
        {ROLE_OPTIONS.map((r) => (
          <option key={r} value={r}>
            {r === "" ? "Filter by role" : r}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TeacherSearchFilter;
