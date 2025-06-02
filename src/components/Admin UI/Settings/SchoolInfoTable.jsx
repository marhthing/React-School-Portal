import React from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const SchoolInfoTable = ({ data, onAdd, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">School Information</h2>
        {!data && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaPlus />
            Add School Info
          </button>
        )}
      </div>

      {data ? (
        <div className="space-y-4">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">School Name:</span>
                <p className="text-gray-900 dark:text-white">{data.full_name || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Abbreviation:</span>
                <p className="text-gray-900 dark:text-white">{data.abbreviation || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Address:</span>
                <p className="text-gray-900 dark:text-white">{data.address || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Motto:</span>
                <p className="text-gray-900 dark:text-white italic">{data.motto || 'N/A'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Phone:</span>
                <p className="text-gray-900 dark:text-white">{data.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Email:</span>
                <p className="text-gray-900 dark:text-white">{data.email || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-300">Website:</span>
                <p className="text-gray-900 dark:text-white">
                  {data.website ? (
                    <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {data.website}
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-300">School Logo:</span>
              {data.logo ? (
                <div className="mt-2">
                  <img 
                    src={`http://localhost/sfgs_api/uploads/${data.logo}`} 
                    alt="School Logo" 
                    className="w-24 h-24 object-contain border rounded-lg bg-white"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/96/96';
                      e.target.alt = 'Logo not found';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{data.logo}</p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No logo uploaded</p>
              )}
            </div>
            
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-300">School Signature:</span>
              {data.signature ? (
                <div className="mt-2">
                  <img 
                    src={`http://localhost/sfgs_api/uploads/${data.signature}`} 
                    alt="School Signature" 
                    className="w-32 h-16 object-contain border rounded-lg bg-white"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/128/64';
                      e.target.alt = 'Signature not found';
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">{data.signature}</p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No signature uploaded</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <FaTrashAlt />
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5M9 21V9a2 2 0 012-2h2a2 2 0 012 2v12M9 21h6" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No school information added yet</p>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md mx-auto transition-colors"
          >
            <FaPlus />
            Add School Information
          </button>
        </div>
      )}
    </div>
  );
};

export default SchoolInfoTable;