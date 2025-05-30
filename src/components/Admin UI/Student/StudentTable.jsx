import React, { useState } from "react";
import EditStudentButton from "./EditStudentButton";
import DeleteStudentButton from "./DeleteStudentButton";

const StudentTable = ({ students, classMap, onEditStudent, onDelete, stateOptions, classOptions }) => {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (regNumber) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [regNumber]: !prev[regNumber],
    }));
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        No students found.
      </div>
    );
  }

  return (
    <>
      {/* MOBILE CARD LAYOUT */}
      <div className="md:hidden space-y-4">
        {students.map((student, index) => {
          const isPasswordVisible = visiblePasswords[student.regNumber];
          const fullName = [
            student.first_name,
            student.other_name,
            student.last_name,
          ]
            .filter(Boolean)
            .join(" ");

          const classNameDisplay =
            classMap && student.target_class
              ? classMap[student.target_class] || student.target_class
              : student.target_class || "N/A";

          return (
            <div
              key={student.regNumber + "_" + index}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold">#{index + 1}</span>
                <div className="flex space-x-2">
<EditStudentButton
  student={student}
  onStudentUpdated={onEditStudent}
  stateOptions={stateOptions}     // ✅ Correct
             classOptions={classOptions}
/>
                  <DeleteStudentButton
                    student={student}
                    onDelete={() => onDelete(student.regNumber)}
                  />
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-semibold">Name: </span>
                  {fullName}
                </div>
                <div>
                  <span className="font-semibold">Gender: </span>
                  {student.gender}
                </div>
                <div>
                  <span className="font-semibold">Class: </span>
                  {classNameDisplay}
                </div>
                <div>
                  <span className="font-semibold">Phone: </span>
                  {student.contact_phone || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Reg Number: </span>
                  {student.regNumber}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Password: </span>
                  <span className="font-mono">
                    {isPasswordVisible
                      ? student.plain_password || "••••••••"
                      : "••••••••"}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(student.regNumber)}
                    className="text-blue-500 hover:underline text-xs"
                  >
                    {isPasswordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE LAYOUT */}
      <div className="hidden md:block overflow-x-auto rounded-md shadow">
        <table className="w-full min-w-[900px] border border-gray-300 dark:border-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border-b text-left">S/N</th>
              <th className="px-4 py-2 border-b text-left">NAMES</th>
              <th className="px-4 py-2 border-b text-left">GENDER</th>
              <th className="px-4 py-2 border-b text-left">CLASS</th>
              <th className="px-4 py-2 border-b text-left">PHONE</th>
              <th className="px-4 py-2 border-b text-left">REG NUMBER</th>
              <th className="px-4 py-2 border-b text-left">PASSWORD</th>
              <th className="px-4 py-2 border-b text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const isPasswordVisible = visiblePasswords[student.regNumber];
              const fullName = [
                student.first_name,
                student.other_name,
                student.last_name,
              ]
                .filter(Boolean)
                .join(" ");

              const classNameDisplay =
                classMap && student.target_class
                  ? classMap[student.target_class] || student.target_class
                  : student.target_class || "N/A";

              return (
                <tr
                  key={student.regNumber + "_" + index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{fullName}</td>
                  <td className="px-4 py-2">{student.gender}</td>
                  <td className="px-4 py-2">{classNameDisplay}</td>
                  <td className="px-4 py-2">{student.contact_phone || "N/A"}</td>
                  <td className="px-4 py-2">{student.regNumber}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">
                        {isPasswordVisible
                          ? student.plain_password || "••••••••"
                          : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(student.regNumber)}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {isPasswordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <EditStudentButton
                        student={student}
                        onStudentUpdated={onEditStudent}
                      />
                      <DeleteStudentButton
                        student={student}
                        onDelete={() => onDelete(student.regNumber)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentTable;
