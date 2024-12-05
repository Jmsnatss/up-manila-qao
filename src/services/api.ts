export const API_BASE_URL = 'http://localhost:5001/api';
export const MEDIA_BASE_URL = 'http://localhost:5001';

export const endpoints = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  verify: `${API_BASE_URL}/auth/verify`,
  announcements: `${API_BASE_URL}/announcements`,
  mediaBaseUrl: MEDIA_BASE_URL,
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearToken();
        throw new Error('Session expired. Please login again.');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'An error occurred. Please try again.');
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};
