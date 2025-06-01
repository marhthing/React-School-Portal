// roleUtils.js - Centralized role management utilities

/**
 * Normalize role to lowercase for consistent comparison
 * @param {string} role - The role to normalize
 * @returns {string} - Normalized role in lowercase
 */
export const normalizeRole = (role) => role?.toLowerCase();

/**
 * Get the correct dashboard route based on user role
 * @param {string} userRole - The user's role
 * @returns {string} - The dashboard route path
 */
export const getDashboardRoute = (userRole) => {
  if (!userRole) return '/login';
  
  const normalizedRole = normalizeRole(userRole);
  
  switch (normalizedRole) {
    case 'admin':
    case 'superadmin':
      return '/adminDashboard';
    case 'student':
      return '/studentDashboard';
    case 'teacher':
    case 'classteacher':
      return '/teacherDashboard';
    default:
      return '/login';
  }
};

/**
 * Check if user has required role(s)
 * @param {string} userRole - The user's current role
 * @param {string|string[]} requiredRole - Required role(s) for access
 * @returns {boolean} - True if user has required role
 */
export const hasRequiredRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  
  const normalizedUserRole = normalizeRole(userRole);
  
  // If requiredRole is an array, check if user role matches any of them
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => normalizeRole(role) === normalizedUserRole);
  }
  
  // If requiredRole is a string, do direct comparison
  return normalizeRole(requiredRole) === normalizedUserRole;
};

/**
 * Check if user is admin (admin or superadmin)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (userRole) => {
  if (!userRole) return false;
  const normalizedRole = normalizeRole(userRole);
  return normalizedRole === 'admin' || normalizedRole === 'superadmin';
};

/**
 * Check if user is teacher (teacher or classteacher)
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is teacher
 */
export const isTeacher = (userRole) => {
  if (!userRole) return false;
  const normalizedRole = normalizeRole(userRole);
  return normalizedRole === 'teacher' || normalizedRole === 'classteacher';
};

/**
 * Check if user is student
 * @param {string} userRole - The user's role
 * @returns {boolean} - True if user is student
 */
export const isStudent = (userRole) => {
  if (!userRole) return false;
  return normalizeRole(userRole) === 'student';
};