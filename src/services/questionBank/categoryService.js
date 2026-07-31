/**
 * Category Service - Cloud Admin
 * Handles API communication for Question Categories
 */

import api from "../../config/axios";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const BASE_URL = API_ENDPOINTS.QUESTION_BANK.CATEGORIES;

/**
 * Get all categories with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Paginated categories
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category data
 */
export const getCategory = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new category
 * @param {Object} data - Category data
 * @param {string} data.name - Category name
 * @param {string} data.description - Category description
 * @param {string} data.status - Category status
 * @returns {Promise<Object>} Created category
 */
export const createCategory = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update a category
 * @param {string} id - Category ID
 * @param {Object} data - Update data
 * @param {string} data.name - Category name
 * @param {string} data.description - Category description
 * @param {string} data.status - Category status
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete (soft delete) a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Deleted category
 */
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Activated category
 */
export const activateCategory = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Deactivated category
 */
export const deactivateCategory = async (id) => {
  try {
    const response = await api.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get category statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Category statistics
 */
export const getCategoryStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active categories (for dropdowns)
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Maximum results
 * @returns {Promise<Object>} Active categories
 */
export const getActiveCategories = async (params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/active`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
