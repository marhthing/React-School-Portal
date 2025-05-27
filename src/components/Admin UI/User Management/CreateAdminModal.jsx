import React, { useState, useEffect, useRef } from 'react';

export default function CreateAdminModal({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  errorMessage,
  canCreateSysAdmin = false, // Pass true if current user can create System Admin
  darkMode = false,          // New prop: whether dark mode is enabled
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setRole('Admin');
      setPassword('');
      setConfirmPassword('');
      setValidationError('');

      // Focus first input after modal opens
      setTimeout(() => firstInputRef.current?.focus(), 0);

      // Add keydown listener for Esc
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Click outside modal to close
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Basic focus trap: keep focus inside modal
  useEffect(() => {
    if (!isOpen) return;

    const focusableElementsString =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    const modalNode = modalRef.current;
    const focusableElements = modalNode.querySelectorAll(focusableElementsString);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modalNode.addEventListener('keydown', handleTab);
    return () => modalNode.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !role.trim() || !password) {
      setValidationError('Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setValidationError('');
    onSubmit({ name: name.trim(), email: email.trim(), role, password });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? 'bg-black bg-opacity-80' : 'bg-black bg-opacity-50'
      }`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="create-admin-title"
    >
      <div
        ref={modalRef}
        className={`rounded shadow-lg w-full max-w-md p-6 ${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2
          id="create-admin-title"
          className={`text-xl font-semibold mb-4 ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}
        >
          Create New Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              className={`block mb-1 font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-300'
              }`}
              required
              autoFocus
              autoComplete="name"
              disabled={submitting}
              ref={firstInputRef}
            />
          </div>

          <div>
            <label
              className={`block mb-1 font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-300'
              }`}
              required
              autoComplete="email"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              className={`block mb-1 font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-300'
              }`}
              required
              disabled={submitting}
            >
              <option value="Admin">Admin</option>
              {canCreateSysAdmin && (
                <option value="System Administrator">System Administrator</option>
              )}
            </select>
          </div>

          <div>
            <label
              className={`block mb-1 font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-300'
              }`}
              required
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              className={`block mb-1 font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${
                darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-100 focus:ring-blue-500'
                  : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-300'
              }`}
              required
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          {(validationError || errorMessage) && (
            <p className="text-red-600">{validationError || errorMessage}</p>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50 ${
                darkMode
                  ? 'border-gray-600 text-gray-200 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700'
              }`}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
