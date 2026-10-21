const BASE_URL = '/api';

/**
 * Custom fetch wrapper with automatic JWT Bearer token injection
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('cinemapp_jwt');

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      // Auto logout on expired token
      localStorage.removeItem('cinemapp_jwt');
      localStorage.removeItem('cinemapp_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const error = new Error(data.message || 'Une erreur est survenue.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authService = {
  register: (payload) => apiRequest('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiRequest('/auth/login', { method: 'POST', body: payload }),
  getMe: () => apiRequest('/auth/me'),
};

export const movieService = {
  search: (query, type = '', page = 1) => {
    const params = new URLSearchParams({ q: query, page });
    if (type && type !== 'all') params.append('type', type);
    return apiRequest(`/movies/search?${params.toString()}`);
  },
  getById: (id) => apiRequest(`/movies/${id}`),
};

export const favoriteService = {
  getAll: () => apiRequest('/favorites'),
  add: (movie) => apiRequest('/favorites', { method: 'POST', body: movie }),
  remove: (imdbID) => apiRequest(`/favorites/${imdbID}`, { method: 'DELETE' }),
};
