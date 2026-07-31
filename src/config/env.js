/**
 * Environment Configuration
 * Centralized environment variables with defaults
 */

export const env = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',

  // App
  appName: import.meta.env.VITE_APP_NAME || 'CBT Admin',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',

  // Auth
  tokenKey: import.meta.env.VITE_TOKEN_KEY || 'accessToken',
  refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refreshToken',
  userKey: import.meta.env.VITE_USER_KEY || 'user',

  // Pagination
  defaultPageSize: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20,
  maxPageSize: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100,

  // Date Formats
  dateFormat: import.meta.env.VITE_DATE_FORMAT || 'DD/MM/YYYY',
  dateTimeFormat: import.meta.env.VITE_DATE_TIME_FORMAT || 'DD/MM/YYYY HH:mm',

  // Features
  enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true' || false,
  enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true' || true,
};

export default env;