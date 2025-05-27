import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

import UserTable from '../../components/Admin UI/User Management/UserTable';
import UserActionButtons from '../../components/Admin UI/User Management/UserActionButtons';
import UserActivityModal from '../../components/Admin UI/User Management/UserActivityModal';
import UserLoginLogModal from '../../components/Admin UI/User Management/UserLoginLogModal';
import CreateAdminModal from '../../components/Admin UI/User Management/CreateAdminModal';
import SearchAndFilter from '../../components/Admin UI/User Management/SearchAndFilter';
import Pagination from '../../components/Admin UI/User Management/Pagination';

import Spinner from "../../components/Spinner";

// Roles used internally in the system
const USER_ROLES = ['system_admin', 'admin', 'student'];

// Base API URL
const API_URL = 'http://localhost/sfgs_api/api/users_api.php';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showLoginLogModal, setShowLoginLogModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);

  const [activityLogs, setActivityLogs] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
 const [darkMode, setDarkMode] = React.useState();
  // This should come from auth context in real app
  const currentUserRole = 'system_admin';

  // Fetch users from API with server-side filtering and pagination
  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      // Build query parameters for filtering and pagination
      const params = new URLSearchParams({
        search: searchText,
        role: roleFilter,
        status: statusFilter,
        page: currentPage,
      });

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();

      // Assume API returns { users: [...], totalPages: N }
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [searchText, roleFilter, statusFilter, currentPage]);

  // Suspend/Activate toggle with role restriction
  async function handleSuspendToggle(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (currentUserRole === 'admin' && user.role === 'system_admin') {
      alert("You don't have permission to suspend a System Administrator.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_suspend',
          userId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to change user status');
      }

      const result = await response.json();

      // Update local UI after success
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to change user status');
    }
  }

  // Fetch activity logs for user
  async function openActivityModal(user) {
    setSelectedUser(user);
    setShowActivityModal(true);
    setModalLoading(true);
    setModalError('');

    try {
      const response = await fetch(`${API_URL}?action=activity_logs&userId=${user.id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load activity logs');
      }

      const data = await response.json();
      setActivityLogs(data.logs || []);
    } catch {
      setModalError('Failed to load activity logs');
    } finally {
      setModalLoading(false);
    }
  }

  // Fetch login logs for user
  async function openLoginLogModal(user) {
    setSelectedUser(user);
    setShowLoginLogModal(true);
    setModalLoading(true);
    setModalError('');

    try {
      const response = await fetch(`${API_URL}?action=login_logs&userId=${user.id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to load login logs');
      }

      const data = await response.json();
      setLoginLogs(data.logs || []);
    } catch {
      setModalError('Failed to load login logs');
    } finally {
      setModalLoading(false);
    }
  }

  // Close modals & clear data
  function closeModals() {
    setShowActivityModal(false);
    setShowLoginLogModal(false);
    setShowCreateAdminModal(false);
    setSelectedUser(null);
    setActivityLogs([]);
    setLoginLogs([]);
  }

  // Create admin API call
  async function handleCreateAdmin(adminData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_admin',
          adminData,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create admin');
      }

      alert('Admin created successfully');
      closeModals();
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to create admin');
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 mt-20">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>

        <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
          <SearchAndFilter
            searchText={searchText}
            onSearchChange={setSearchText}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          {currentUserRole === 'system_admin' && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowCreateAdminModal(true)}
            >
              Create Admin
            </button>
          )}
        </div>

        {loading ? (
          <p><Spinner /></p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            <UserTable
              users={users}
              onSuspendToggle={handleSuspendToggle}
              onViewActivity={openActivityModal}
              onViewLoginLog={openLoginLogModal}
              currentUserRole={currentUserRole}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        {showActivityModal && selectedUser && (
          <UserActivityModal
            isOpen={showActivityModal}
            onClose={closeModals}
            userName={selectedUser.name}
            activityLogs={activityLogs}
            loading={modalLoading}
            error={modalError}
          />
        )}

        {showLoginLogModal && selectedUser && (
          <UserLoginLogModal
            user={selectedUser}
            onClose={closeModals}
            loginLogs={loginLogs}
            loading={modalLoading}
            error={modalError}
          />
        )}

{showCreateAdminModal && (
  <CreateAdminModal
    isOpen={showCreateAdminModal}
    onClose={closeModals}
    onSubmit={handleCreateAdmin}
    submitting={false}
    errorMessage={null}
    canCreateSysAdmin={currentUserRole === 'system_admin'}
    darkMode={darkMode}  
  />
)}

      </div>
    </AdminLayout>
  );
}
