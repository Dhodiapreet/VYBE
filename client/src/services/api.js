const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(API_BASE_URL + path, {
    ...options,
    headers,
  });
  if (!response.ok) throw new Error('API request failed: ' + response.status);
  return response.status === 204 ? null : response.json();
}

export { API_BASE_URL };
