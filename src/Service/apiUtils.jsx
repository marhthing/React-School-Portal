// apiUtils.js - Simple utility to get base URL and make requests
export const getBaseURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost/sfgs_api/api';
};

// Generic fetch utility with timeout and error handling
export const apiRequest = async (endpoint, options = {}) => {
  const baseURL = getBaseURL();
  const url = `${baseURL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check if response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection');
    }
    console.error('API Request Error:', error);
    throw error;
  }
};