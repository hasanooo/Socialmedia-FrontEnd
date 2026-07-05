import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  withCredentials: true,
  headers: {
    // Required by the backend's CSRF middleware; cross-site form submissions can't set this.
    'X-Requested-With': 'XMLHttpRequest',
  },
});

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthEndpoint = original?.url?.includes('/auth/');

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        refreshPromise ??= apiClient.post('/auth/refresh').then(() => undefined).finally(() => {
          refreshPromise = null;
        });
        await refreshPromise;
        return apiClient(original);
      } catch {
        // fall through to reject with the original error
      }
    }

    return Promise.reject(error);
  },
);
