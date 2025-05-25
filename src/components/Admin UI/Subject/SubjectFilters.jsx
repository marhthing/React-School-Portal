import React from 'react';

export default function SubjectFilters({
  searchTerm,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterClass,
  onClassChange,
  filterTeacher,
  onTeacherChange,
  classes,
  teachers,
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or abbreviation"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border rounded px-3 py-2 flex-grow min-w-[200px]
                   bg-white text-gray-900 placeholder-gray-500
                   dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400
                   dark:border-gray-600"
      />

      {/* Category Dropdown */}
      <select
        value={filterCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border rounded px-3 py-2
                   bg-white text-gray-900
                   dark:bg-gray-700 dark:text-gray-100
                   dark:border-gray-600"
      >
        <option value="">All Categories</option>
        <option value="General">General</option>
        <option value="Science">Science</option>
        <option value="Art">Art</option>
      </select>

      {/* Class Dropdown */}
      <select
        value={filterClass}
        onChange={(e) => onClassChange(e.target.value)}
        className="border rounded px-3 py-2
                   bg-white text-gray-900
                   dark:bg-gray-700 dark:text-gray-100
                   dark:border-gray-600"
      >
        <option value="">All Classes</option>
        {classes.map((cls) => (
  <option key={cls.id} value={cls.id}>
    {cls.name}
  </option>
))}

      </select>

      {/* Teacher Dropdown */}
      <select
        value={filterTeacher}
        onChange={(e) => onTeacherChange(e.target.value)}
        className="border rounded px-3 py-2
                   bg-white text-gray-900
                   dark:bg-gray-700 dark:text-gray-100
                   dark:border-gray-600"
      >
        <option value="">All Teachers</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
    </div>
  );
}
