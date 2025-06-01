import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';

const ActiveUsersContext = createContext();

export const useActiveUsers = () => {
  const context = useContext(ActiveUsersContext);
  if (!context) {
    throw new Error('useActiveUsers must be used within ActiveUsersProvider');
  }
  return context;
};

export const ActiveUsersProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState(0);
  const [userSession] = useState(() => {
    // Generate unique session ID for this user
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });
  const [isActive, setIsActive] = useState(true);
  const heartbeatIntervalRef = useRef(null);
  const isRegisteredRef = useRef(false);
  const lastRouteRef = useRef(window.location.pathname);
  const requestQueueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const debounceTimerRef = useRef(null);

  // Memoize user data to prevent unnecessary recalculations
  const currentUserData = useMemo(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        role: userData.role || 'unknown',
        name: userData.name || 'Anonymous',
        timestamp: Date.now(),
        current_route: window.location.pathname
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        role: 'unknown',
        name: 'Anonymous',
        timestamp: Date.now(),
        current_route: window.location.pathname
      };
    }
  }, []);

  // Debounced API call to prevent spam
  const debouncedApiCall = useCallback((apiCall, delay = 1000) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (!isProcessingRef.current) {
        apiCall();
      }
    }, delay);
  }, []);

  // Queue-based API requests to prevent overwhelming the server
  const queueApiRequest = useCallback(async (requestData) => {
    requestQueueRef.current.push(requestData);
    
    if (!isProcessingRef.current) {
      await processRequestQueue();
    }
  }, []);

  const processRequestQueue = useCallback(async () => {
    if (isProcessingRef.current || requestQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    
    try {
      // Process only the latest request of each type to avoid spam
      const latestRequests = {};
      requestQueueRef.current.forEach(req => {
        latestRequests[req.action] = req;
      });
      
      requestQueueRef.current = [];
      
      for (const request of Object.values(latestRequests)) {
        try {
          const response = await fetch('http://localhost/sfgs_api/api/active-users.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(request)
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.active_count !== undefined) {
              setActiveUsers(data.active_count);
            }
          }
        } catch (error) {
          // Silently handle individual request failures
          console.warn('API request failed:', error.message);
        }
        
        // Small delay between requests to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  // Optimized route change detection
  const handleRouteChange = useCallback(() => {
    const currentRoute = window.location.pathname;
    if (currentRoute !== lastRouteRef.current) {
      lastRouteRef.current = currentRoute;
      
      // Debounce route change heartbeat
      debouncedApiCall(() => {
        queueApiRequest({
          action: 'heartbeat',
          session_id: userSession,
          status: isActive ? 'active' : 'idle',
          current_route: currentRoute,
          timestamp: Date.now()
        });
      }, 500);
    }
  }, [userSession, isActive, debouncedApiCall, queueApiRequest]);

  const registerUser = useCallback(async () => {
    try {
      await queueApiRequest({
        action: 'register',
        session_id: userSession,
        user_data: currentUserData
      });
      console.log('User registered successfully:', userSession);
    } catch (error) {
      console.error('Failed to register user:', error);
    }
  }, [userSession, currentUserData, queueApiRequest]);

  const sendHeartbeat = useCallback((status = 'active') => {
    queueApiRequest({
      action: 'heartbeat',
      session_id: userSession,
      status: status,
      current_route: window.location.pathname,
      timestamp: Date.now()
    });
  }, [userSession, queueApiRequest]);

  const unregisterUser = useCallback(async () => {
    try {
      // For unregister, use immediate fetch since it's cleanup
      await fetch('http://localhost/sfgs_api/api/active-users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'unregister',
          session_id: userSession
        })
      });
      console.log('User unregistered:', userSession);
    } catch (error) {
      console.error('Failed to unregister user:', error);
    }
  }, [userSession]);

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    // Increased heartbeat interval to reduce server load
    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat(isActive ? 'active' : 'idle');
    }, 45000); // Every 45 seconds instead of 30
  }, [isActive, sendHeartbeat]);

  // Throttled event handlers
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      setIsActive(false);
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        // Reduce frequency when idle
        heartbeatIntervalRef.current = setInterval(() => {
          sendHeartbeat('idle');
        }, 120000); // Every 2 minutes when idle
      }
    } else {
      setIsActive(true);
      startHeartbeat();
      sendHeartbeat('active');
    }
  }, [startHeartbeat, sendHeartbeat]);

  const handleFocus = useCallback(() => {
    setIsActive(true);
    debouncedApiCall(() => sendHeartbeat('active'), 2000);
  }, [sendHeartbeat, debouncedApiCall]);

  const handleBlur = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleBeforeUnload = useCallback(() => {
    // Use sendBeacon for more reliable cleanup
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        action: 'unregister',
        session_id: userSession
      });
      
      const blob = new Blob([data], { type: 'application/json' });
      navigator.sendBeacon('http://localhost/sfgs_api/api/active-users.php', blob);
    } else {
      unregisterUser();
    }
  }, [userSession, unregisterUser]);

  useEffect(() => {
    // Only register once per session
    if (!isRegisteredRef.current) {
      registerUser();
      isRegisteredRef.current = true;
    }

    startHeartbeat();

    // Optimized route checking - use MutationObserver instead of polling
    let routeObserver;
    if ('MutationObserver' in window) {
      routeObserver = new MutationObserver(handleRouteChange);
      routeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }

    // Also listen for popstate for back/forward navigation
    window.addEventListener('popstate', handleRouteChange, { passive: true });
    window.addEventListener('beforeunload', handleBeforeUnload, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });
    window.addEventListener('focus', handleFocus, { passive: true });
    window.addEventListener('blur', handleBlur, { passive: true });

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (routeObserver) {
        routeObserver.disconnect();
      }
      
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      unregisterUser();
    };
  }, [
    registerUser,
    startHeartbeat,
    handleRouteChange,
    handleBeforeUnload,
    handleVisibilityChange,
    handleFocus,
    handleBlur,
    unregisterUser
  ]);

  // Function to manually refresh active users count (throttled)
  const refreshActiveUsers = useCallback(() => {
    debouncedApiCall(() => {
      queueApiRequest({
        action: 'get_count'
      });
    }, 1000);
  }, [debouncedApiCall, queueApiRequest]);

  const contextValue = useMemo(() => ({
    activeUsers,
    userSession,
    isActive,
    refreshActiveUsers
  }), [activeUsers, userSession, isActive, refreshActiveUsers]);

  return (
    <ActiveUsersContext.Provider value={contextValue}>
      {children}
    </ActiveUsersContext.Provider>
  );
};