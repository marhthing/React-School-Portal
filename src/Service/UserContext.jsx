import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage on mount
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.id && parsedUser?.role) {
          return parsedUser;
        }
      }
    } catch (error) {
      console.warn('Failed to parse user data from localStorage:', error);
      localStorage.removeItem('userData');
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback((userData) => {
    const userInfo = {
      id: userData.id,
      name: userData.name,
      role: userData.role.toLowerCase()
    };
    
    setUser(userInfo);
    try {
      localStorage.setItem('userData', JSON.stringify(userInfo));
    } catch (error) {
      console.warn('Failed to save user data to localStorage:', error);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('userData');
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return user !== null && user?.id && user?.role;
  }, [user]);

  const hasRole = useCallback((role) => {
    return user?.role === role.toLowerCase();
  }, [user]);

  const updateUser = useCallback((updates) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    try {
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.warn('Failed to update user data in localStorage:', error);
    }
  }, [user]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    updateUser,
    setLoading
  }), [user, loading, login, logout, isAuthenticated, hasRole, updateUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};