/* eslint-disable no-unused-vars */
/**
 * Profile Service
 * API communication for user profile management
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

// ============================================================
// MOCK DATA (Until backend endpoints are ready)
// ============================================================

const MOCK_PROFILE = {
  success: true,
  data: {
    id: 'user123',
    name: 'John Doe',
    email: 'superadmin@cbt.com',
    phone: '+234 801 234 5678',
    role: 'SUPER_ADMIN',
    permissions: [
      'CREATE_CATEGORY',
      'VIEW_CATEGORY',
      'UPDATE_CATEGORY',
      'DELETE_CATEGORY',
      'CREATE_SUBJECT',
      'VIEW_SUBJECT',
      'UPDATE_SUBJECT',
      'DELETE_SUBJECT',
      'CREATE_TOPIC',
      'VIEW_TOPIC',
      'UPDATE_TOPIC',
      'DELETE_TOPIC',
      'CREATE_QUESTION',
      'VIEW_QUESTION',
      'UPDATE_QUESTION',
      'DELETE_QUESTION',
      'SUBMIT_QUESTION',
      'PUBLISH_QUESTION',
      'REVIEW_QUESTION',
      'UPLOAD_MEDIA',
      'VIEW_MEDIA',
      'UPDATE_MEDIA',
      'DELETE_MEDIA',
      'UPLOAD_IMPORT',
      'PROCESS_IMPORT',
      'VIEW_IMPORT_REPORT',
      'VIEW_USERS',
      'CREATE_USER',
      'UPDATE_USER',
      'DELETE_USER',
      'VIEW_SETTINGS',
      'UPDATE_SETTINGS',
      'VIEW_AUDIT',
      'VIEW_STATISTICS',
    ],
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:30:00.000Z',
    lastLogin: '2026-07-23T08:45:00.000Z',
    lastLoginIp: '192.168.1.100',
    lastLoginDevice: 'Chrome on Windows',
    passwordLastChanged: '2026-07-20T14:30:00.000Z',
    avatar: null,
  },
};

const MOCK_ACTIVITIES = {
  success: true,
  data: [
    {
      id: '1',
      action: 'LOGIN',
      module: 'AUTH',
      description: 'User logged in successfully',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      action: 'QUESTION_APPROVED',
      module: 'QUESTION_BANK',
      description: 'Approved question "What is the capital of Nigeria?"',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      action: 'PASSWORD_CHANGED',
      module: 'AUTH',
      description: 'Password changed successfully',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: '4',
      action: 'PROFILE_UPDATED',
      module: 'USER',
      description: 'Profile information updated',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
      id: '5',
      action: 'BULK_IMPORT',
      module: 'QUESTION_BANK',
      description: 'Imported 150 questions from Excel',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: '6',
      action: 'LOGOUT',
      module: 'AUTH',
      description: 'User logged out',
      status: 'SUCCESS',
      ipAddress: '192.168.1.100',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
  ],
};

const MOCK_LOGIN_HISTORY = {
  success: true,
  data: [
    {
      id: '1',
      loginDate: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      device: 'Windows',
      browser: 'Chrome 114',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
    },
    {
      id: '2',
      loginDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      device: 'Windows',
      browser: 'Chrome 114',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
    },
    {
      id: '3',
      loginDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      device: 'MacOS',
      browser: 'Safari 16',
      ipAddress: '192.168.1.101',
      status: 'SUCCESS',
    },
    {
      id: '4',
      loginDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      device: 'iPhone',
      browser: 'Safari Mobile',
      ipAddress: '192.168.1.102',
      status: 'FAILED',
    },
    {
      id: '5',
      loginDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
      device: 'Windows',
      browser: 'Edge 112',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
    },
  ],
};

// ============================================================
// SERVICE FUNCTIONS
// ============================================================

/**
 * Get user profile
 * @returns {Promise<Object>} User profile
 */
export const getProfile = async () => {
  try {
    // Try to fetch from API, fallback to mock
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (apiError) {
      console.warn('Using mock profile data:', apiError.message);
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_PROFILE;
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PROFILE;
  }
};

/**
 * Update user profile
 * @param {Object} data - Profile update data
 * @param {string} data.name - Full name
 * @param {string} data.phone - Phone number
 * @returns {Promise<Object>} Updated profile
 */
export const updateProfile = async (data) => {
  try {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, data);
      return response.data;
    } catch (apiError) {
      console.warn('Using mock update profile:', apiError.message);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Profile updated successfully',
        data: { ...MOCK_PROFILE.data, ...data },
      };
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Profile updated successfully',
      data: { ...MOCK_PROFILE.data, ...data },
    };
  }
};

/**
 * Upload avatar
 * @param {File} file - Image file
 * @returns {Promise<Object>} Uploaded avatar URL
 */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (apiError) {
      console.warn('Using mock avatar upload:', apiError.message);
      await new Promise(resolve => setTimeout(resolve, 800));
      const reader = new FileReader();
      const avatarUrl = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      return {
        success: true,
        message: 'Avatar uploaded successfully',
        data: { avatarUrl },
      };
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Generate a data URL for mock
    const reader = new FileReader();
    const avatarUrl = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
    return {
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatarUrl },
    };
  }
};

/**
 * Change password
 * @param {Object} data - Password change data
 * @param {string} data.currentPassword - Current password
 * @param {string} data.newPassword - New password
 * @returns {Promise<Object>} Response
 */
export const changePassword = async (data) => {
  try {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return response.data;
    } catch (apiError) {
      console.warn('Using mock change password:', apiError.message);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Password changed successfully',
      };
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
};

/**
 * Get activity log
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.module - Filter by module
 * @param {string} params.action - Filter by action
 * @returns {Promise<Object>} Activity log
 */
export const getActivityLog = async (params = {}) => {
  try {
    try {
      const response = await api.get(API_ENDPOINTS.AUDIT.BASE, { params });
      return response.data;
    } catch (apiError) {
      console.warn('Using mock activity log:', apiError.message);
      await new Promise(resolve => setTimeout(resolve, 400));
      const { page = 1, limit = 10 } = params;
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = MOCK_ACTIVITIES.data.slice(start, end);
      return {
        success: true,
        data,
        total: MOCK_ACTIVITIES.data.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(MOCK_ACTIVITIES.data.length / limit),
      };
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const { page = 1, limit = 10 } = params;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = MOCK_ACTIVITIES.data.slice(start, end);
    return {
      success: true,
      data,
      total: MOCK_ACTIVITIES.data.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(MOCK_ACTIVITIES.data.length / limit),
    };
  }
};

/**
 * Get login history
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Login history
 */
export const getLoginHistory = async (params = {}) => {
  try {
    try {
      const response = await api.get('/profile/login-history', { params });
      return response.data;
    } catch (apiError) {
      console.warn('Using mock login history:', apiError.message);
      await new Promise(resolve => setTimeout(resolve, 400));
      const { page = 1, limit = 10 } = params;
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = MOCK_LOGIN_HISTORY.data.slice(start, end);
      return {
        success: true,
        data,
        total: MOCK_LOGIN_HISTORY.data.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(MOCK_LOGIN_HISTORY.data.length / limit),
      };
    }
  } catch (error) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const { page = 1, limit = 10 } = params;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = MOCK_LOGIN_HISTORY.data.slice(start, end);
    return {
      success: true,
      data,
      total: MOCK_LOGIN_HISTORY.data.length,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(MOCK_LOGIN_HISTORY.data.length / limit),
    };
  }
};