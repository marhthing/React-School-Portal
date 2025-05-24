import React from "react";

const MAX_CA1 = 20;
const MAX_CA2 = 20;
const MAX_EXAM = 60;

const ScoreInputCardList = ({ studentsScores, onScoreChange }) => {
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
    <div className="space-y-4">
      {studentsScores.map((stu, idx) => (
        <div
          key={stu.id}
          className={`border rounded p-4 shadow-sm
            ${stu.errors.total 
              ? "bg-red-50 border-red-400 dark:bg-red-900 dark:border-red-600" 
              : "bg-white dark:bg-gray-800 dark:border-gray-700"}
          `}
        >
          <div className="mb-2 font-semibold text-lg text-gray-900 dark:text-gray-100">
            {idx + 1}. {stu.name}
          </div>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Reg Number: {stu.regNo}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-2">
            {/* CA1 */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                htmlFor={`ca1-${stu.id}`}
              >
                CA1 (20)
              </label>
              <input
                id={`ca1-${stu.id}`}
                type="number"
                min="0"
                max={MAX_CA1}
                step="1"
                className={`w-full border rounded px-2 py-1
                  ${
                    stu.errors.ca1
                      ? "border-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                `}
                value={stu.ca1}
                onChange={(e) => handleInputChange(e, stu.id, "ca1")}
              />
              {stu.errors.ca1 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {stu.errors.ca1}
                </p>
              )}
            </div>

            {/* CA2 */}
            <div>
              <label
                className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                htmlFor={`ca2-${stu.id}`}
              >
                CA2 (20)
              </label>
              <input
                id={`ca2-${stu.id}`}
                type="number"
                min="0"
                max={MAX_CA2}
                step="1"
                className={`w-full border rounded px-2 py-1
                  ${
                    stu.errors.ca2
                      ? "border-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                `}
                value={stu.ca2}
                onChange={(e) => handleInputChange(e, stu.id, "ca2")}
              />
              {stu.errors.ca2 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {stu.errors.ca2}
                </p>
              )}
            </div>
          </div>

          {/* Exam */}
          <div className="mb-2">
            <label
              className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
              htmlFor={`exam-${stu.id}`}
            >
              Exam (60)
            </label>
            <input
              id={`exam-${stu.id}`}
              type="number"
              min="0"
              max={MAX_EXAM}
              step="1"
              className={`w-full border rounded px-2 py-1
                ${
                  stu.errors.exam
                    ? "border-red-500 dark:border-red-600"
                    : "border-gray-300 dark:border-gray-600"
                }
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
              `}
              value={stu.exam}
              onChange={(e) => handleInputChange(e, stu.id, "exam")}
            />
            {stu.errors.exam && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {stu.errors.exam}
              </p>
            )}
          </div>

          {/* Total */}
          <div
            className={`font-semibold mt-2 ${
              stu.errors.total ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-gray-200"
            }`}
          >
            Total: {stu.total}
            {stu.errors.total && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {stu.errors.total}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreInputCardList;
