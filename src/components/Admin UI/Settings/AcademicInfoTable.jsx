import React from "react";
import { FaEdit, FaPlus } from "react-icons/fa";

const AcademicInfoTable = ({ data, onAdd, onEdit }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Academic Information</h2>
        {!data && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <FaPlus />
            Add Academic Info
          </button>
        )}
      </div>

      {data ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border">Current Term</th>
                <th className="px-4 py-2 border">Current Session</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="px-4 py-2 border">{data.current_term}</td>
                <td className="px-4 py-2 border">{data.current_session}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300 italic">
          No academic info set yet.
        </p>
      )}
    </div>
  );
};

export default AcademicInfoTable;
