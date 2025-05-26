import React from 'react';

const ResultCalculationForm = ({
  classes = [],
  terms = [],
  sessions = [],
  selectedClass,
  selectedTerm,
  selectedSession,
  onClassChange,
  onTermChange,
  onSessionChange,
  onCalculate,
  loading,
  message,
}) => {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Calculate Results</h2>

      {/* Class Select */}
      <label className="block mb-2 font-medium" htmlFor="class-select">
        Select Class
      </label>
      <select
        id="class-select"
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={selectedClass || ''}
        onChange={(e) => onClassChange(e.target.value)}
      >
        <option value="">-- Select Class --</option>
        {Array.isArray(classes) &&
          classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
      </select>

      {/* Term Select */}
      <label className="block mb-2 font-medium" htmlFor="term-select">
        Select Term
      </label>
      <select
        id="term-select"
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={selectedTerm || ''}
        onChange={(e) => onTermChange(e.target.value)}
      >
        <option value="">-- Select Term --</option>
        {Array.isArray(terms) &&
          terms.map((term) => (
            <option key={term.name} value={term.name}>
              {term.name}
            </option>
          ))}
      </select>

      {/* Session Select */}
      <label className="block mb-2 font-medium" htmlFor="session-select">
        Select Session
      </label>
      <select
        id="session-select"
        className="w-full mb-6 p-2 border rounded dark:bg-gray-700 dark:text-white"
        value={selectedSession || ''}
        onChange={(e) => onSessionChange(e.target.value)}
      >
        <option value="">-- Select Session --</option>
        {Array.isArray(sessions) &&
          sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name}
            </option>
          ))}
      </select>

      {/* Submit Button */}
      <button
        onClick={onCalculate}
        disabled={loading}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Calculating...' : 'Calculate Results'}
      </button>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
    </section>
  );
};

export default ResultCalculationForm;
