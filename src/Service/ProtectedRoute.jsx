import React from 'react';
import { Navigate } from 'react-router-dom';
import { getDashboardRoute, hasRequiredRole } from './roleUtils'; // Import centralized utilities

const ProtectedRoute = ({ children, requiredRole }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const role = userData?.role;

  if (!role) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRequiredRole(role, requiredRole)) {
    // Logged in but wrong role, redirect to their correct dashboard
    return <Navigate to={getDashboardRoute(role)} replace />;
  }

  // Authorized, render the protected component
  return children;
};

export default ProtectedRoute;