import React from "react";

const StudentSearchFilter = ({ filterValues, onFilterChange, classOptions = [] }) => {
  const { name = "", classId = "", regNumber = "" } = filterValues || {};

  const handleNameChange = (e) => {
    onFilterChange({ ...filterValues, name: e.target.value });
  };

  const handleClassChange = (e) => {
    onFilterChange({ ...filterValues, classId: e.target.value });
  };

  const handleRegNumberChange = (e) => {
    onFilterChange({ ...filterValues, regNumber: e.target.value });
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
        value={classId}
        onChange={handleClassChange}
        className="px-3 py-2 border rounded-md w-full sm:w-1/3 dark:bg-gray-700 dark:text-white"
      >
        <option value="">Filter by class</option>
        {classOptions.map((cls) => (
          <option key={cls.id} value={cls.id}>
            {cls.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSearchFilter;
