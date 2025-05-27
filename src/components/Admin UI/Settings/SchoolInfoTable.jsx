import React from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const SchoolInfoTable = ({ data, onAdd, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">School Information</h2>
        {!data && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <FaPlus />
            Add School Info
          </button>
        )}
      </div>

      {data ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Abbreviation</th>
                <th className="px-4 py-2 border">Logo Path</th>
                <th className="px-4 py-2 border">Signature</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="px-4 py-2 border">{data.full_name}</td>
                <td className="px-4 py-2 border">{data.abbreviation}</td>
                <td className="px-4 py-2 border">{data.logo}</td>
                <td className="px-4 py-2 border">{data.signature}</td>
                <td className="px-4 py-2 border flex items-center justify-center gap-4">
                  <button
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-300 italic">
          No school info added yet.
        </p>
      )}
    </div>
  );
};

export default SchoolInfoTable;
