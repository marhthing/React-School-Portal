import React from 'react';
import UserActionButtons from './UserActionButtons';

export default function UserTable({
  users,
  onSuspendToggle,
  onViewActivity,
  onViewLoginLog,
  currentUserRole,
}) {
  if (!users || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border-b text-left">S/N</th>
          <th className="px-4 py-2 border-b text-left">Name</th>
          <th className="px-4 py-2 border-b text-left">ID</th>
          <th className="px-4 py-2 border-b text-left">Role</th>
          <th className="px-4 py-2 border-b text-left">Status</th>
          <th className="px-4 py-2 border-b text-left">Recent Activity</th>
          <th className="px-4 py-2 border-b text-left">Login History</th>
          <th className="px-4 py-2 border-b text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => (
          <tr key={user.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{index + 1}</td>
            <td className="px-4 py-2 border-b">{user.name}</td>
            <td className="px-4 py-2 border-b">{user.id}</td>
            <td className="px-4 py-2 border-b capitalize">{user.role.replace('_', ' ')}</td>
            <td
              className={`px-4 py-2 border-b font-semibold ${
                user.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {user.status}
            </td>

            <td className="px-4 py-2 border-b">
              <button
                onClick={() => onViewActivity(user)}
                className="text-blue-600 hover:underline"
                aria-label={`View recent activity for ${user.name}`}
              >
                View
              </button>
            </td>

            <td className="px-4 py-2 border-b">
              <button
                onClick={() => onViewLoginLog(user)}
                className="text-blue-600 hover:underline"
                aria-label={`View login history for ${user.name}`}
              >
                View
              </button>
            </td>

            <td className="px-4 py-2 border-b">
              <UserActionButtons
                user={user}
                onSuspendToggle={onSuspendToggle}
                currentUserRole={currentUserRole}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
