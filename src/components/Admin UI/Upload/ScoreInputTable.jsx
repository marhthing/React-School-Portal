import React from "react";

const MAX_CA1 = 20;
const MAX_CA2 = 20;
const MAX_EXAM = 60;

const ScoreInputTable = ({ studentsScores, onScoreChange }) => {
  const handleInputChange = (e, studentId, field) => {
    const value = e.target.value;

    if (value === "" || /^[0-9\b]+$/.test(value)) {
      let numValue = value === "" ? "" : Number(value);
      if (field === "ca1" && numValue > MAX_CA1) numValue = MAX_CA1;
      if (field === "ca2" && numValue > MAX_CA2) numValue = MAX_CA2;
      if (field === "exam" && numValue > MAX_EXAM) numValue = MAX_EXAM;

      onScoreChange(studentId, field, numValue);
    }
  };

  return (
    <div className="overflow-x-auto rounded-md shadow">
      <table className="w-full border border-gray-300 dark:border-gray-700 text-sm text-left">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 w-10">S/N</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 min-w-[140px]">Student Name</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 min-w-[100px]">Reg Number</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">CA1 (20)</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">CA2 (20)</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">Exam (60)</th>
            <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">Total</th>
          </tr>
        </thead>
        <tbody>
          {studentsScores.map((stu, idx) => (
            <tr
              key={stu.id}
              className={`${
                stu.errors.total ? "bg-red-50 dark:bg-red-900" : "bg-white dark:bg-gray-900"
              } border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800`}
            >
              <td className="px-3 py-2">{idx + 1}</td>
              <td className="px-3 py-2">{stu.name}</td>
              <td className="px-3 py-2">{stu.regNo}</td>

              {/* CA1 */}
              <td className="px-1 py-1 text-center">
                <input
                  type="number"
                  min="0"
                  max={MAX_CA1}
                  className={`w-full text-center border rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    stu.errors.ca1 ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  value={stu.ca1}
                  onChange={(e) => handleInputChange(e, stu.id, "ca1")}
                />
                {stu.errors.ca1 && <p className="text-xs text-red-600">{stu.errors.ca1}</p>}
              </td>

              {/* CA2 */}
              <td className="px-1 py-1 text-center">
                <input
                  type="number"
                  min="0"
                  max={MAX_CA2}
                  className={`w-full text-center border rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    stu.errors.ca2 ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  value={stu.ca2}
                  onChange={(e) => handleInputChange(e, stu.id, "ca2")}
                />
                {stu.errors.ca2 && <p className="text-xs text-red-600">{stu.errors.ca2}</p>}
              </td>

              {/* Exam */}
              <td className="px-1 py-1 text-center">
                <input
                  type="number"
                  min="0"
                  max={MAX_EXAM}
                  className={`w-full text-center border rounded px-1 py-0.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    stu.errors.exam ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  value={stu.exam}
                  onChange={(e) => handleInputChange(e, stu.id, "exam")}
                />
                {stu.errors.exam && <p className="text-xs text-red-600">{stu.errors.exam}</p>}
              </td>

              {/* Total */}
              <td className="px-3 py-2 text-center font-semibold">{stu.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreInputTable;
