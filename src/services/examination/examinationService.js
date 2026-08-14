/**
 * Examination Service - Cloud Admin
 * Handles API communication for Examination Management
 */

import api from "../../config/axios";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

// Use the BASE URL directly from API_ENDPOINTS
const EXAM_URL = API_ENDPOINTS.EXAMINATIONS?.BASE || "/api/v1/examinations";

/**
 * Create a new examination
 * @param {Object} data - Examination data
 * @returns {Promise<Object>} Created examination
 */
export const createExamination = async (data) => {
  try {
    const response = await api.post(EXAM_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all examinations with pagination and filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status (single status or comma-separated)
 * @param {string} params.examinationType - Filter by type
 * @param {number} params.promotionYear - Filter by year
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise<Object>} Paginated examinations
 */
export const getExaminations = async (params = {}) => {
  try {
    console.log("📋 Fetching examinations with params:", params);
    
    // ✅ FIX: Convert sort parameter to the format expected by backend
    const queryParams = { ...params };
    
    // If sort is provided as string like '-createdAt', convert it
    if (queryParams.sort && typeof queryParams.sort === 'string') {
      const sortValue = queryParams.sort;
      if (sortValue.startsWith('-')) {
        queryParams.sortBy = sortValue.substring(1);
        queryParams.sortOrder = 'desc';
      } else {
        queryParams.sortBy = sortValue;
        queryParams.sortOrder = 'asc';
      }
      delete queryParams.sort;
    }
    
    // ✅ FIX: Handle status parameter - if it's a single status, keep as is
    // The backend expects status as a string or comma-separated
    // Don't modify the status - let it pass through
    if (queryParams.status && queryParams.status === 'VALIDATED') {
      // Keep as 'VALIDATED' - backend should accept this
      console.log("✅ Filtering by status: VALIDATED");
    }
    
    // Remove undefined values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    
    console.log("📋 Sending query params:", queryParams);
    
    const response = await api.get(EXAM_URL, { params: queryParams });
    console.log("📋 Examinations response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Get examinations error:", error);
    // Log the actual error response for debugging
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error.response?.data || error;
  }
};

/**
 * Get examination by ID
 * @param {string} id - Examination ID
 * @returns {Promise<Object>} Examination details
 */
export const getExamination = async (id) => {
  try {
    const response = await api.get(`${EXAM_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update examination
 * @param {string} id - Examination ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated examination
 */
export const updateExamination = async (id, data) => {
  try {
    const response = await api.put(`${EXAM_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Archive examination
 * @param {string} id - Examination ID
 * @param {Object} data - Archive data
 * @param {string} data.reason - Archive reason
 * @returns {Promise<Object>} Archived examination
 */
export const archiveExamination = async (id, data = {}) => {
  try {
    const response = await api.patch(`${EXAM_URL}/${id}/archive`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Restore archived examination
 * @param {string} id - Examination ID
 * @returns {Promise<Object>} Restored examination
 */
export const restoreExamination = async (id) => {
  try {
    const response = await api.patch(`${EXAM_URL}/${id}/restore`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get examination statistics
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {string} params.examinationType - Filter by type
 * @param {number} params.promotionYear - Filter by year
 * @returns {Promise<Object>} Examination statistics
 */
export const getExaminationStats = async (params = {}) => {
  try {
    // Remove undefined values
    const queryParams = { ...params };
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') {
        delete queryParams[key];
      }
    });
    
    const response = await api.get(`${EXAM_URL}/stats`, { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check if examination code is available
 * @param {string} code - Examination code
 * @param {string} excludeId - Examination ID to exclude
 * @returns {Promise<Object>} Availability check
 */
export const checkCodeAvailability = async (code, excludeId = null) => {
  try {
    const response = await api.get(`${EXAM_URL}/check-code`, {
      params: { code, excludeId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Clone an examination
 * @param {string} id - Examination ID to clone
 * @param {Object} data - Clone data
 * @param {string} data.title - New title
 * @param {string} data.code - New code
 * @returns {Promise<Object>} Cloned examination
 */
export const cloneExamination = async (id, data) => {
  try {
    const response = await api.post(`${EXAM_URL}/${id}/clone`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createExamination,
  getExaminations,
  getExamination,
  updateExamination,
  archiveExamination,
  restoreExamination,
  getExaminationStats,
  checkCodeAvailability,
  cloneExamination,
};