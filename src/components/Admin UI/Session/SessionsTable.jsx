// src/components/SessionsTable.jsx
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function SessionsTable({ sessions, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 border rounded">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Session Name</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                No sessions available.
              </td>
            </tr>
          ) : (
            sessions.map((session, index) => (
              <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b">{session.name}</td>
                <td className="p-3 border-b space-x-3">
                  <button
                    onClick={() => onEdit(session)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDelete(session)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
