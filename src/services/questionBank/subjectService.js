/**
 * Subject Service - Cloud Admin
 * Handles API communication for Subjects
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const BASE_URL = API_ENDPOINTS.QUESTION_BANK.SUBJECTS;
const CATEGORY_URL = API_ENDPOINTS.QUESTION_BANK.CATEGORIES;

/**
 * Get all subjects with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.categoryId - Filter by category
 * @param {string} params.status - Filter by status
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated subjects
 */
export const getSubjects = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get subject by ID
 * @param {string} id - Subject ID
 * @returns {Promise<Object>} Subject data
 */
export const getSubject = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new subject
 * @param {Object} data - Subject data
 * @param {string} data.name - Subject name
 * @param {string} data.code - Subject code
 * @param {string} data.categoryId - Category ID
 * @param {string} data.description - Subject description
 * @param {string} data.status - Subject status
 * @returns {Promise<Object>} Created subject
 */
export const createSubject = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a subject
 * @param {string} id - Subject ID
 * @param {Object} data - Update data
 * @param {string} data.name - Subject name
 * @param {string} data.code - Subject code
 * @param {string} data.categoryId - Category ID
 * @param {string} data.description - Subject description
 * @param {string} data.status - Subject status
 * @returns {Promise<Object>} Updated subject
 */
export const updateSubject = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete (soft delete) a subject
 * @param {string} id - Subject ID
 * @returns {Promise<Object>} Deleted subject
 */
export const deleteSubject = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate a subject
 * @param {string} id - Subject ID
 * @returns {Promise<Object>} Activated subject
 */
export const activateSubject = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate a subject
 * @param {string} id - Subject ID
 * @returns {Promise<Object>} Deactivated subject
 */
export const deactivateSubject = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get subject statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Subject statistics
 */
export const getSubjectStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active categories (for dropdown)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Active categories
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await api.get(`${CATEGORY_URL}/active`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get subjects by category (for dropdowns)
 * @param {string} categoryId - Category ID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Subjects by category
 */
export const getSubjectsByCategory = async (categoryId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/by-category/${categoryId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};