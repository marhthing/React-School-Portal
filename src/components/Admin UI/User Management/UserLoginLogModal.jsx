import React from 'react';

export default function UserLoginLogModal({
  user,
  loginLogs,
  loading,
  error,
  onClose,
  darkMode = false, // added darkMode prop, default false
}) {
  if (!user) return null; // don't render if no user

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`
          w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto rounded shadow-lg
          ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}
        `}
      >
        <h2 className="text-xl font-semibold mb-4">
          Login History for{' '}
          <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>
            {user.name}
          </span>
        </h2>

        {loading && (
          <p className="text-center text-gray-400 dark:text-gray-300">
            Loading login history...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <>
            {loginLogs.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No login records found.
              </p>
            ) : (
              <table
                className={`
                  w-full border-collapse border
                  ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                `}
              >
                <thead>
                  <tr className={darkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                    <th className="border px-3 py-2 text-left border-gray-300 dark:border-gray-600">
                      Date &amp; Time
                    </th>
                    <th className="border px-3 py-2 text-left border-gray-300 dark:border-gray-600">
                      IP Address
                    </th>
                    <th className="border px-3 py-2 text-left border-gray-300 dark:border-gray-600">
                      Device / Browser
                    </th>
                    <th className="border px-3 py-2 text-left border-gray-300 dark:border-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loginLogs.map((log, idx) => (
                    <tr
                      key={idx}
                      className={
                        idx % 2 === 0
                          ? darkMode
                            ? 'bg-gray-800'
                            : 'bg-white'
                          : darkMode
                          ? 'bg-gray-700'
                          : 'bg-gray-50'
                      }
                    >
                      <td className="border px-3 py-2 border-gray-300 dark:border-gray-600">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="border px-3 py-2 border-gray-300 dark:border-gray-600">
                        {log.ipAddress || '-'}
                      </td>
                      <td className="border px-3 py-2 border-gray-300 dark:border-gray-600">
                        {log.deviceInfo || '-'}
                      </td>
                      <td className="border px-3 py-2 border-gray-300 dark:border-gray-600">
                        {log.status || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`
              px-4 py-2 rounded
              ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-300 hover:bg-gray-400'}
            `}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
