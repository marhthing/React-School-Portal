import React, { useState } from "react";
import EditTeacherButton from "./EditTeacherButton";
import DeleteTeacherButton from "./DeleteTeacherButton";

const TeacherTable = ({ teachers, onEdit, onDelete }) => {
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (teachers.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 dark:text-gray-400">
        No teachers found.
      </div>
    );
  }

  return (
    <>
      {/* MOBILE CARD LAYOUT */}
      <div className="md:hidden space-y-4">
        {teachers.map((teacher, index) => {
          const isPasswordVisible = visiblePasswords[teacher.id];
          return (
            <div
              key={teacher.id}
              className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold">#{index + 1}</span>
                <div className="flex space-x-2">
                  <EditTeacherButton
                    teacher={teacher}
                    onClick={() => onEdit(teacher)}
                  />
                  <DeleteTeacherButton
                    teacher={teacher}
                    onDelete={() => onDelete(teacher.id)}  // FIXED HERE
                  />
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-semibold">Name: </span>
                  {teacher.fullName}
                </div>
                <div>
                  <span className="font-semibold">Gender: </span>
                  {teacher.gender}
                </div>
                <div>
                  <span className="font-semibold">Role: </span>
                  {teacher.role}
                </div>
                <div>
                  <span className="font-semibold">Phone: </span>
                  {teacher.phone}
                </div>
                <div>
                  <span className="font-semibold">Email: </span>
                  {teacher.email}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">Password: </span>
                  <span className="font-mono">
                    {isPasswordVisible ? teacher.password : "••••••••"}
                  </span>
                  <button
                    onClick={() => togglePasswordVisibility(teacher.id)}
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
              <th className="px-4 py-2 border-b text-left">NAME</th>
              <th className="px-4 py-2 border-b text-left">GENDER</th>
              <th className="px-4 py-2 border-b text-left">ROLE</th>
              <th className="px-4 py-2 border-b text-left">PHONE</th>
              <th className="px-4 py-2 border-b text-left">EMAIL</th>
              <th className="px-4 py-2 border-b text-left">PASSWORD</th>
              <th className="px-4 py-2 border-b text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => {
              const isPasswordVisible = visiblePasswords[teacher.id];
              return (
                <tr
                  key={teacher.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 break-words">{teacher.fullName}</td>
                  <td className="px-4 py-2">{teacher.gender}</td>
                  <td className="px-4 py-2">{teacher.role}</td>
                  <td className="px-4 py-2">{teacher.phone}</td>
                  <td className="px-4 py-2">{teacher.email}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono">
                        {isPasswordVisible ? teacher.password : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(teacher.id)}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        {isPasswordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <EditTeacherButton
                        teacher={teacher}
                        onClick={() => onEdit(teacher)}
                      />
                      <DeleteTeacherButton
                        teacher={teacher}
                        onDelete={() => onDelete(teacher.id)}  // FIXED HERE
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

export default TeacherTable;
