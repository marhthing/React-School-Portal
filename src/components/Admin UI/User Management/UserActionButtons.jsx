import React from 'react';

export default function UserActionButtons({ user, onSuspendToggle, currentUserRole, darkMode = false }) {
  const isCurrentUserAdmin = currentUserRole === 'admin';
  const isTargetUserSystemAdmin = user.role === 'system_admin';

  // Admins cannot suspend system admins
  const canModify = !(isCurrentUserAdmin && isTargetUserSystemAdmin);

  // Button base classes with color variants for light/dark mode
  const baseClasses = `
    px-3 py-1 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  `;

  // Colors depending on status and darkMode
  const activeClass = darkMode
    ? 'bg-red-700 hover:bg-red-800'
    : 'bg-red-600 hover:bg-red-700';

  const inactiveClass = darkMode
    ? 'bg-green-700 hover:bg-green-800'
    : 'bg-green-600 hover:bg-green-700';

  return (
    <button
      onClick={() => canModify && onSuspendToggle(user.id)}
      disabled={!canModify}
      className={`${baseClasses} ${user.status === 'active' ? activeClass : inactiveClass}`}
      aria-label={user.status === 'active' ? `Suspend ${user.name}` : `Activate ${user.name}`}
      title={
        canModify
          ? user.status === 'active' ? 'Suspend User' : 'Activate User'
          : 'You do not have permission to modify this user'
      }
    >
      {user.status === 'active' ? 'Suspend' : 'Activate'}
    </button>
  );
}
