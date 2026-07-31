import axios from 'axios';
import { env } from './env';
import { storage, tokenHelper } from '../utils';

// Create axios instance
const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenHelper.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Check if data is FormData - if so, let axios set the content type with boundary
    if (config.data && config.data instanceof FormData) {
      // Remove Content-Type header for FormData - axios will set it with boundary
      delete config.headers['Content-Type'];
      console.log('📤 Sending FormData request to:', config.url);
    } else if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
      // Only set for non-FormData requests
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenHelper.getRefreshToken();
        if (refreshToken) {
          // Attempt to refresh token
          const response = await axios.post(
            `${env.apiUrl}/auth/refresh`,
            { refreshToken }
          );

          if (response.data?.success) {
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            tokenHelper.setAccessToken(accessToken);
            tokenHelper.setRefreshToken(newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenHelper.clearTokens();
        storage.remove(env.userKey);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      window.location.href = '/403';
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;