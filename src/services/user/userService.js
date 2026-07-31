/**
 * User Service - Cloud Admin
 * Handles API communication for User Management
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const USERS_URL = API_ENDPOINTS.USERS?.BASE || '/api/v1/users';

/**
 * Get all users with pagination and filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.role - Filter by role
 * @param {string} params.sort - Sort field and direction
 * @returns {Promise<Object>} Paginated users
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get(USERS_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User details
 */
export const getUser = async (id) => {
  try {
    const response = await api.get(`${USERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new user
 * @param {Object} data - User data
 * @param {string} data.name - User name
 * @param {string} data.email - User email
 * @param {string} data.staffId - Staff ID
 * @param {string} data.phone - Phone number
 * @param {string} data.role - Role ID or name
 * @param {string} data.centre - Centre ID
 * @param {string} data.status - User status
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (data) => {
  try {
    const response = await api.post(USERS_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`${USERS_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete user (soft delete)
 * @param {string} id - User ID
 * @returns {Promise<Object>} Deleted user
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`${USERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate user
 * @param {string} id - User ID
 * @returns {Promise<Object>} Activated user
 */
export const activateUser = async (id) => {
  try {
    const response = await api.patch(`${USERS_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Suspend user
 * @param {string} id - User ID
 * @returns {Promise<Object>} Suspended user
 */
export const suspendUser = async (id) => {
  try {
    const response = await api.patch(`${USERS_URL}/${id}/suspend`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reset user password (admin action)
 * @param {string} id - User ID
 * @returns {Promise<Object>} Reset result
 */
export const resetUserPassword = async (id) => {
  try {
    const response = await api.post(`${USERS_URL}/${id}/reset-password`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get users by role
 * @param {string} roleId - Role ID or role name
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Users with role
 */
export const getUsersByRole = async (roleId, params = {}) => {
  try {
    const response = await api.get(`${USERS_URL}/role/${roleId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get users by centre
 * @param {string} centreId - Centre ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Users at centre
 */
export const getUsersByCentre = async (centreId, params = {}) => {
  try {
    const response = await api.get(`${USERS_URL}/centre/${centreId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} User statistics
 */
export const getUserStats = async (params = {}) => {
  try {
    const response = await api.get(`${USERS_URL}/stats`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  activateUser,
  suspendUser,
  resetUserPassword,
  getUsersByRole,
  getUsersByCentre,
  getUserStats,
};