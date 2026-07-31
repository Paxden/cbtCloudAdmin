/**
 * Application Constants
 * Reusable app-wide constants
 */

import env from '../config/env';

export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: env.defaultPageSize,
  MAX_PAGE_SIZE: env.maxPageSize,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // Date Formats
  DATE_FORMAT: env.dateFormat,
  DATE_TIME_FORMAT: env.dateTimeFormat,
  API_DATE_FORMAT: 'YYYY-MM-DD',
  API_DATE_TIME_FORMAT: 'YYYY-MM-DDTHH:mm:ss.SSSZ',

  // Status Colors
  STATUS_COLORS: {
    ACTIVE: '#2e7d32',
    INACTIVE: '#9e9e9e',
    DRAFT: '#ed6c02',
    PENDING_REVIEW: '#0288d1',
    APPROVED: '#1976d2',
    PUBLISHED: '#2e7d32',
    REJECTED: '#d32f2f',
    ARCHIVED: '#9e9e9e',
    PROCESSING: '#ed6c02',
    COMPLETED: '#2e7d32',
    FAILED: '#d32f2f',
    PARTIAL: '#ed6c02',
  },

  // Status Labels
  STATUS_LABELS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DRAFT: 'Draft',
    PENDING_REVIEW: 'Pending Review',
    APPROVED: 'Approved',
    PUBLISHED: 'Published',
    REJECTED: 'Rejected',
    ARCHIVED: 'Archived',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
    PARTIAL: 'Partial',
  },

  // Toast
  TOAST_DURATION: 5000,
  TOAST_POSITION: 'top-right',

  // Storage Keys
  STORAGE_KEYS: {
    THEME: 'theme',
    LANGUAGE: 'language',
    SIDEBAR_OPEN: 'sidebarOpen',
    NOTIFICATIONS: 'notifications',
  },

  // Default Images
  DEFAULT_AVATAR: '/images/default-avatar.png',
  DEFAULT_LOGO: '/images/logo.png',

  // API Response Status
  API_STATUS: {
    SUCCESS: 'success',
    ERROR: 'error',
    FAIL: 'fail',
  },
};

export default APP_CONSTANTS;