import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './Service/UserContext'; // Adjust path if needed
import Login from './Service/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentPage from './pages/Admin pages/StudentPage';
import TeacherPage from './pages/Admin pages/TeacherPage';
import ProtectedRoute from './Service/ProtectedRoute';
import SessionPage from './pages/Admin pages/SessionPage';
import SubjectPage from './pages/Admin pages/SubjecttPage';
import UploadPage from './pages/Admin pages/UploadPage';
import PublishPage from './pages/Admin pages/PublishPage';
import ReportPage from './pages/Admin pages/ReportPage'
import UserManagementPage from './pages/Admin pages/UserManagementPage';
import SettingsPage from './pages/Admin pages/SettingsPage';
import PrintSlipPage from './pages/Admin pages/PrintSlipPage';
import StudentRegisterPage from './pages/Admin pages/StudentRegisterPage';
import { getDashboardRoute } from './Service/roleUtils'; // Import centralized utility

const App = () => {
  const { user, loading } = useUser();
  const role = user?.role;

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login route: redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={role ? <Navigate to={getDashboardRoute(role)} replace /> : <Login />}
      />
      
      {/* Root route: redirect to appropriate dashboard or login */}
      <Route
        path="/"
        element={
          role ? (
            <Navigate to={getDashboardRoute(role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Dashboard routes */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/studentDashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/teacherDashboard"
        element={
          <ProtectedRoute requiredRole={['teacher', 'classteacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin-only routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <StudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <TeacherPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <SessionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subject"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <SubjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <UploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/publish"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <PublishPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <ReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-manage"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/setting"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slip"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <PrintSlipPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute requiredRole={['admin', 'superadmin']}>
            <StudentRegisterPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;