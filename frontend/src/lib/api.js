// API Configuration - Centralized API base URL
// In development, Vite proxy handles /api routes
// In production, Vite uses the VITE_API_URL environment variable
const rawApiUrl = import.meta.env.VITE_API_URL || '';
export const API_BASE_URL = rawApiUrl 
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) 
  : '/api';

// Helper function for authenticated API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('campus_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  return response;
};

// Function to set custom backend IP (for testing different networks)
export const setBackendIP = (ip) => {
  window.localStorage.setItem('backend_ip', ip);
  console.log(`Backend IP set to: ${ip}`);
};

// Function to get current backend IP
export const getBackendIP = () => {
  return window.localStorage.getItem('backend_ip') || '172.20.136.237';
};