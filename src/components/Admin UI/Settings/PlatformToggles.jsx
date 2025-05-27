import React from "react";

const PlatformToggles = ({ toggles, onToggleChange }) => {
  const handleChange = (key) => {
    onToggleChange(key, !toggles[key]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Platform Settings</h2>
      <div className="space-y-4">
        <ToggleItem
          label="Disable All Student Logins"
          value={toggles.disable_student_login}
          onChange={() => handleChange("disable_student_login")}
        />
        <ToggleItem
          label="Maintenance Mode (Only Super Admins Can Login)"
          value={toggles.maintenance_mode}
          onChange={() => handleChange("maintenance_mode")}
        />
        <ToggleItem
          label="Allow Teachers to Upload Results"
          value={toggles.enable_result_uploads}
          onChange={() => handleChange("enable_result_uploads")}
        />
      </div>
    </div>
  );
};

const ToggleItem = ({ label, value, onChange }) => {
  return (
    <div className="flex justify-between items-center border-b pb-2">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={value}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          {value ? "On" : "Off"}
        </span>
      </label>
    </div>
  );
};

export default PlatformToggles;
