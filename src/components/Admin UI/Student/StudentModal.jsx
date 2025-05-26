import React, { useState, useEffect } from "react";

const initialFormState = {
  firstName: "",
  lastName: "",
  otherName: "",
  gender: "Male",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  phone: "",
  homeAddress: "",
  state: "",
  nationality: "",
  sponsorName: "",
  sponsorPhone: "",
  sponsorRelationship: "",
  className: "",
  password: "",
};

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const StudentModal = ({ mode, studentData = {}, onSubmit, onClose, classOptions}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && studentData) {
      setFormData({
        fullName: studentData.fullName || "",
        gender: studentData.gender || "Male",
        className: studentData.className || "",
        phone: studentData.phone || "",
        regNumber: studentData.regNumber || "",
        password: "", // Keep blank on edit unless changed
      });
    }
  }, [mode, studentData]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required";
    if (!formData.className.trim()) errs.className = "Class is required";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    if (!formData.regNumber.trim()) errs.regNumber = "Reg Number is required";
    if (mode === "create" && !formData.password.trim())
      errs.password = "Password is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Call onSubmit with form data
    onSubmit(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2
          id="student-modal-title"
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100"
        >
          {mode === "create" ? "Register New Student" : "Edit Student"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.fullName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              autoComplete="off"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

        {/* Class */}
<div>
  <label
    htmlFor="className"
    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    Class <span className="text-red-500">*</span>
  </label>
  <select
    id="className"
    name="className"
    value={formData.className}
    onChange={handleChange}
    className={`mt-1 block w-full rounded-md border ${
      errors.className
        ? "border-red-500"
        : "border-gray-300 dark:border-gray-600"
    } shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
  >
    <option value="">Select class</option>
{classOptions?.map((c) => (
  <option key={c.id} value={c.id}>{c.name}</option>
))}
  </select>
  {errors.className && (
    <p className="text-red-500 text-xs mt-1">{errors.className}</p>
  )}
</div>




          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              autoComplete="off"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Reg Number */}
          <div>
            <label
              htmlFor="regNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reg Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="regNumber"
              name="regNumber"
              value={formData.regNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.regNumber
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
              autoComplete="off"
              disabled={mode === "edit"} // Prevent editing Reg Number on edit for uniqueness
            />
            {errors.regNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.regNumber}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password{" "}
              {mode === "create" && <span className="text-red-500">*</span>}
              {mode === "edit" && (
                <span className="text-xs text-gray-500">
                  (Leave blank to keep unchanged)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } shadow-sm pr-10 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {mode === "create" ? "Register" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
