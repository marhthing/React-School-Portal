import React, { useState } from "react";

const PlatformToggles = ({ toggles, onToggleChange }) => {
  const [loading, setLoading] = useState({});

  const handleChange = async (key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      const newValue = !toggles[key];
      
      // Delegate to parent component to handle API call
      await onToggleChange(key, newValue);
      
    } catch (error) {
      console.error('Error updating setting:', error);
      // Parent component should handle the error, but we can show user feedback here
      alert('Failed to update setting. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Platform Settings</h2>
      <div className="space-y-4">
        <ToggleItem
          label="Disable All Student Logins"
          description="Prevent all students from logging into the platform"
          value={toggles.disable_student_login}
          loading={loading.disable_student_login}
          onChange={() => handleChange("disable_student_login")}
        />
        <ToggleItem
          label="Maintenance Mode"
          description="Only Super Admins can login during maintenance"
          value={toggles.maintenance_mode}
          loading={loading.maintenance_mode}
          onChange={() => handleChange("maintenance_mode")}
        />
        <ToggleItem
          label="Allow Teachers to Upload Results"
          description="Enable teachers to upload student results"
          value={toggles.enable_result_uploads}
          loading={loading.enable_result_uploads}
          onChange={() => handleChange("enable_result_uploads")}
        />
      </div>
    </div>
  );
};

const ToggleItem = ({ label, description, value, loading, onChange }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex-1">
        <span className="text-gray-800 dark:text-white font-medium block">{label}</span>
        {description && (
          <span className="text-sm text-gray-600 dark:text-gray-400">{description}</span>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={value}
            onChange={onChange}
            disabled={loading}
          />
          <div className={`w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300 ${loading ? 'opacity-50' : ''}`}>
            <div className={`absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {value ? "On" : "Off"}
          </span>
        </label>
      </div>
    </div>
  );
};

export default PlatformToggles;