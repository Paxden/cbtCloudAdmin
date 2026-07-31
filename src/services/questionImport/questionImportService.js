/**
 * Question Import Service - Cloud Admin
 * Handles API communication for Bulk Question Import
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const IMPORT_URL = API_ENDPOINTS.QUESTION_BANK.IMPORT;

/**
 * Upload questions for import
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @param {boolean} options.autoImport - Auto import without confirmation
 * @returns {Promise<Object>} Upload response
 */
export const uploadQuestions = async (file, options = {}) => {
  try {
    const { autoImport = true } = options;
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`${IMPORT_URL}?autoImport=${autoImport}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get import history with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @param {string} params.userId - Filter by uploader
 * @param {string} params.search - Search term
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date
 * @returns {Promise<Object>} Paginated imports
 */
export const getImports = async (params = {}) => {
  try {
    const response = await api.get(IMPORT_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get import details by ID
 * @param {string} id - Import ID
 * @returns {Promise<Object>} Import details
 */
export const getImportDetails = async (id) => {
  try {
    const response = await api.get(`${IMPORT_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get import statistics
 * @param {Object} params - Filter parameters
 * @param {string} params.userId - Filter by uploader
 * @param {string} params.startDate - Start date
 * @param {string} params.endDate - End date
 * @returns {Promise<Object>} Import statistics
 */
export const getImportStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${IMPORT_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Download import report
 * @param {string} id - Import ID
 * @param {string} format - Report format (json, csv)
 * @returns {Promise<Blob>} Report blob
 */
export const downloadReport = async (id, format = 'json') => {
  try {
    const response = await api.get(`${IMPORT_URL}/${id}/report`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  uploadQuestions,
  getImports,
  getImportDetails,
  getImportStatistics,
  downloadReport,
};