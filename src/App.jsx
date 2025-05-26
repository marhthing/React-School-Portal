import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentPage  from './pages/Admin pages/StudentPage';
import TeacherPage  from './pages/Admin pages/TeacherPage';

import ProtectedRoute from './components/ProtectedRoute';
import SessionPage from './pages/Admin pages/SessionPage';
import SubjectPage from './pages/Admin pages/SubjecttPage';
import UploadPage from './pages/Admin pages/UploadPage';
import PublishPage from './pages/Admin pages/PublishPage';
import ReportPage from './pages/Admin pages/ReportPage'

const App = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const role = userData?.role;

  return (
    <Routes>
      {/* Login route: only accessible if not logged in */}
      <Route
        path="/login"
        element={role ? <Navigate to={`/${role}Dashboard`} replace /> : <Login />}
      />

      {/* Root route: redirect to dashboard or login */}
      <Route
        path="/"
        element={
          role ? <Navigate to={`/${role}Dashboard`} replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Admin dashboard route */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student dashboard route */}
      <Route
        path="/studentDashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher dashboard route */}
      <Route
        path="/teacherDashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

<Route
  path="/student"
  element={
    <ProtectedRoute requiredRole="admin">
      <StudentPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/teacher"
  element={
    <ProtectedRoute requiredRole="admin">
      <TeacherPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/session"
  element={
    <ProtectedRoute requiredRole="admin">
      <SessionPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/subject"
  element={
    <ProtectedRoute requiredRole="admin">
      <SubjectPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/upload"
  element={
    <ProtectedRoute requiredRole="admin">
      <UploadPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/publish"
  element={
    <ProtectedRoute requiredRole="admin">
      <PublishPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/report"
  element={
    <ProtectedRoute requiredRole="admin">
      <ReportPage/>
    </ProtectedRoute>
  }
/>

    </Routes>
  );
};

export default App;
