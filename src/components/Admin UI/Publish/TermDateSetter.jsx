import React from 'react';

const TermDateSetter = ({
  endOfTerm,
  nextTermStart,
  onEndOfTermChange,
  onNextTermStartChange,
  onSaveDates,
  saving,
  message,
}) => {
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Set Term Dates</h2>

      {/* End of Term Date */}
      <label htmlFor="end-of-term" className="block mb-2 font-medium">
        End of Term
      </label>
      <input
        id="end-of-term"
        type="date"
        value={endOfTerm || ''}
        onChange={(e) => onEndOfTermChange(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Next Term Start Date */}
      <label htmlFor="next-term-start" className="block mb-2 font-medium">
        Next Term Start
      </label>
      <input
        id="next-term-start"
        type="date"
        value={nextTermStart || ''}
        onChange={(e) => onNextTermStartChange(e.target.value)}
        className="w-full mb-6 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* Save Button */}
      <button
        onClick={onSaveDates}
        disabled={saving}
        className={`w-full py-2 px-4 rounded text-white font-semibold ${
          saving ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {saving ? 'Saving...' : 'Save Dates'}
      </button>

      {/* Feedback Message */}
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

export default TermDateSetter;
