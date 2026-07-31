// authService.js - Updated version
import api from "../../config/axios";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} Login response
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 Login credentials:', credentials);
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    console.log('✅ Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * Logout user
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} Logout response
 */
export const logout = async (refreshToken) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Forgot password
 * @param {string} email - User email
 * @returns {Promise<Object>} Response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Change password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
