import React from 'react';

export default function UserActivityModal({
  isOpen,
  onClose,
  userName,
  activityLogs = [], // default empty array to avoid errors
  loading,
  error,
  darkMode = false,  // darkMode prop controls theme
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`rounded shadow-lg w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto
          ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'}`}
      >
        <h2 className="text-xl font-semibold mb-4">
          Recent Activity for <span className="text-blue-600">{userName}</span>
        </h2>

        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading activity logs...</p>
        )}

        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <>
            {activityLogs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">No activity records found.</p>
            ) : (
              <ul className="space-y-2">
                {activityLogs.map((log, idx) => (
                  <li
                    key={idx}
                    className={`border-b pb-2 ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className={darkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-700'}>
                      <strong>{log.action || 'Unknown action'}</strong>
                    </div>
                    <div className={darkMode ? 'text-xs text-gray-400' : 'text-xs text-gray-500'}>
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    {log.details && (
                      <div className={darkMode ? 'text-xs italic text-gray-400' : 'text-xs italic text-gray-600'}>
                        {log.details}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
