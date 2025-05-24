import React from 'react';

export default function ConfirmDeleteModal({ 
  itemName = 'this item', 
  onConfirm, 
  onCancel 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow-lg max-w-sm w-full p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Confirm Delete</h2>
        <p className="mb-6">Are you sure you want to delete <strong>{itemName}</strong>?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
