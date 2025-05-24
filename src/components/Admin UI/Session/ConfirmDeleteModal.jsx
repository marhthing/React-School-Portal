// src/components/ConfirmDeleteModal.jsx
import React from "react";
import { Dialog } from "@headlessui/react";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Confirm Deletion
          </Dialog.Title>

          <p className="mb-6 text-sm">
            Are you sure you want to delete{" "}
            <span className="font-medium">{itemName}</span>? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
