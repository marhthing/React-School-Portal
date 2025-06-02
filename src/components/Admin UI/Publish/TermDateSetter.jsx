import React from 'react';

const TermDateSetter = ({
  endOfTerm,
  nextTermStart,
  onEndOfTermChange,
  onNextTermStartChange,
  onSaveDates,
  saving,
  message,
  currentTerm,
  currentSession,
}) => {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Set Term Dates</h2>

      {/* Current Term and Session Display */}
      {(currentTerm || currentSession) && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-medium">Current Context:</span> {currentTerm} - {currentSession}
          </p>
        </div>
      )}

      {/* End of Term Date */}
      <div className="mb-4">
        <label htmlFor="end-of-term" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          End of Term Date
        </label>
        <input
          id="end-of-term"
          type="date"
          value={endOfTerm || ''}
          onChange={(e) => onEndOfTermChange(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Next Term Start Date */}
      <div className="mb-6">
        <label htmlFor="next-term-start" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Next Term Start Date
        </label>
        <input
          id="next-term-start"
          type="date"
          value={nextTermStart || ''}
          onChange={(e) => onNextTermStartChange(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={onSaveDates}
        disabled={saving || !endOfTerm || !nextTermStart}
        className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors ${
          saving || !endOfTerm || !nextTermStart
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
        }`}
      >
        {saving ? 'Saving...' : 'Save Term Dates'}
      </button>

      {/* Feedback Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
    </section>
  );
};

export default TermDateSetter;