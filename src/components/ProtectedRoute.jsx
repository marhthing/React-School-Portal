import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const role = userData?.role;

  if (!role) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in but wrong role, redirect to their correct dashboard
    return <Navigate to={`/${role}Dashboard`} replace />;
  }

  // Authorized, render the protected component
  return children;
};

export default ProtectedRoute;
