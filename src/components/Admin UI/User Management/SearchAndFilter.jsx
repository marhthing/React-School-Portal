import React from 'react';

export default function SearchAndFilter({
  searchText,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  roles = ['All', 'System Administrator', 'Admin', 'User'], // Example role options
  statuses = ['All', 'active', 'suspended'], // Example status options
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or ID"
        value={searchText}
        onChange={e => onSearchChange(e.target.value)}
        className="border rounded px-3 py-2 flex-grow min-w-[200px] 
          bg-white text-gray-900 placeholder-gray-400
          dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-600"
        aria-label="Search users by name or ID"
      />

      {/* Role Filter Dropdown */}
      <select
        value={roleFilter}
        onChange={e => onRoleFilterChange(e.target.value)}
        className="border rounded px-3 py-2
          bg-white text-gray-900
          dark:bg-gray-700 dark:text-gray-100
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-600"
        aria-label="Filter users by role"
      >
        {roles.map(roleOption => (
          <option key={roleOption} value={roleOption === 'All' ? '' : roleOption}>
            {roleOption}
          </option>
        ))}
      </select>

      {/* Status Filter Dropdown */}
      <select
        value={statusFilter}
        onChange={e => onStatusFilterChange(e.target.value)}
        className="border rounded px-3 py-2
          bg-white text-gray-900
          dark:bg-gray-700 dark:text-gray-100
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-600"
        aria-label="Filter users by status"
      >
        {statuses.map(statusOption => (
          <option key={statusOption} value={statusOption === 'All' ? '' : statusOption}>
            {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
