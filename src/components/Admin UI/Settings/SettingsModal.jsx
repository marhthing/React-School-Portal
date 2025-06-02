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
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit" : "Add"} {isSchoolInfo ? "School Info" : "Academic Info"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSchoolInfo ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="School Full Name"
                  name="school_full_name"
                  value={formData.school_full_name || formData.full_name || ""}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="School Abbreviation"
                  name="school_abbreviation"
                  value={formData.school_abbreviation || formData.abbreviation || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <InputField
                label="School Address"
                name="school_address"
                value={formData.school_address || formData.address || ""}
                onChange={handleChange}
                textarea
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  type="tel"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  type="email"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Website URL"
                  name="website"
                  value={formData.website || ""}
                  onChange={handleChange}
                  type="url"
                />
                <InputField
                  label="School Motto"
                  name="motto"
                  value={formData.motto || ""}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileField
                  label="School Logo"
                  name="school_logo"
                  onChange={handleChange}
                  currentFile={formData.logo}
                />
                <FileField
                  label="School Signature"
                  name="school_signature"
                  onChange={handleChange}
                  currentFile={formData.signature}
                />
              </div>
            </>
          ) : (
            <>
              <InputField
                label="Current Session"
                name="current_session"
                value={formData.current_session || ""}
                onChange={handleChange}
                placeholder="e.g., 2024/2025"
                required
              />
              <InputField
                label="Current Term"
                name="current_term"
                value={formData.current_term || ""}
                onChange={handleChange}
                placeholder="e.g., First Term"
                required
              />
            </>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              {mode === "edit" ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", required = false, textarea = false, placeholder = "" }) => (
  <div>
    <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

const FileField = ({ label, name, onChange, currentFile }) => (
  <div>
    <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {currentFile && (
      <div className="mt-2">
        <p className="text-sm text-gray-500">Current file: {currentFile}</p>
        {currentFile && (
          <div className="mt-1">
            <img 
              src={`http://localhost/sfgs_api/uploads/${currentFile}`} 
              alt="Current file preview" 
              className="w-16 h-16 object-cover rounded border"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    )}
  </div>
);

export default SettingsModal;