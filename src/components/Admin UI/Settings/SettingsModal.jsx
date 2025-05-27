import React, { useState, useEffect } from "react";

const SettingsModal = ({ type, mode = "add", initialValues = {}, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(initialValues || {});
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type: inputType, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Use modal type prop to determine form type
  const isSchoolInfo = type === "school";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit" : "Add"} {isSchoolInfo ? "School Info" : "Academic Info"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSchoolInfo ? (
            <>
              <InputField
                label="School Full Name"
                name="school_full_name"
                value={formData.school_full_name || ""}
                onChange={handleChange}
              />
              <InputField
                label="Abbreviation"
                name="school_abbreviation"
                value={formData.school_abbreviation || ""}
                onChange={handleChange}
              />
              <FileField
                label="School Logo"
                name="school_logo"
                onChange={handleChange}
                currentFile={formData.school_logo}
              />
              <InputField
                label="School Signature"
                name="school_signature"
                value={formData.school_signature || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <InputField
                label="Current Term"
                name="current_term"
                value={formData.current_term || ""}
                onChange={handleChange}
              />
              <InputField
                label="Current Session"
                name="current_session"
                value={formData.current_session || ""}
                onChange={handleChange}
              />
            </>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {mode === "edit" ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
      required
    />
  </div>
);

const FileField = ({ label, name, onChange, currentFile }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      className="w-full border px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white"
    />
    {typeof currentFile === "string" && (
      <p className="text-sm text-gray-500 mt-1">Current: {currentFile}</p>
    )}
  </div>
);

export default SettingsModal;
