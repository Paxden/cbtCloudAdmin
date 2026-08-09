/**
 * Candidate Paper Service - Frontend
 * 
 * Service responsibilities:
 * - Make API calls to backend endpoints
 * - Handle request/response transformation
 * - Error handling
 * 
 * Matches backend: /api/v1/candidate-papers
 */

import api from '../../config/axios';
import API_ENDPOINTS from '../../constants/apiEndpoints';

const BASE_URL = `${API_ENDPOINTS.BASE || '/api/v1'}/candidate-papers`;

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error('Candidate Paper API Error:', error);
  
  if (error.response) {
    const { status, data } = error.response;
    let message = 'An unexpected error occurred. Please try again.';
    
    switch (status) {
      case 400:
        message = data?.message || 'Invalid request parameters.';
        break;
      case 401:
        message = 'Your session has expired. Please log in again.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = data?.message || 'Conflict: The paper cannot be modified.';
        break;
      case 429:
        message = 'Too many requests. Please wait and try again.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      default:
        message = data?.message || message;
    }
    
    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.data = data;
    formattedError.validationErrors = data?.validationErrors || [];
    formattedError.validationWarnings = data?.validationWarnings || [];
    throw formattedError;
  }
  
  if (error.request) {
    throw new Error('Network error. Please check your internet connection.');
  }
  
  throw error;
};

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Generate a paper for a specific candidate
 * POST /api/v1/candidate-papers/generate
 * 
 * @param {Object} data - Generation data
 * @param {string} data.instanceId - Instance ID
 * @param {string} data.candidateId - Candidate ID
 * @param {string} data.selectionRule - RANDOM, FIXED, or MIXED
 * @param {string} data.questionOrder - RANDOM, BLUEPRINT, or FIXED
 * @param {string} data.optionOrder - RANDOM or FIXED
 * @param {string} data.notes - Optional notes
 * @returns {Promise<Object>} Generated paper
 */
export const generatePaper = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/generate`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate papers for all candidates in a centre
 * POST /api/v1/candidate-papers/generate/centre
 * 
 * @param {Object} data - Generation data
 * @param {string} data.instanceId - Instance ID
 * @param {string} data.centreId - Centre ID
 * @param {Array} data.candidateIds - Optional specific candidates
 * @param {string} data.selectionRule - RANDOM, FIXED, or MIXED
 * @param {string} data.questionOrder - RANDOM, BLUEPRINT, or FIXED
 * @param {string} data.optionOrder - RANDOM or FIXED
 * @param {string} data.notes - Optional notes
 * @returns {Promise<Object>} Generation results
 */
export const generateCentrePapers = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/generate/centre`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Generate papers for all candidates in all centres
 * POST /api/v1/candidate-papers/generate/all
 * 
 * @param {Object} data - Generation data
 * @param {string} data.instanceId - Instance ID
 * @param {Array} data.centreIds - Optional specific centres
 * @param {string} data.selectionRule - RANDOM, FIXED, or MIXED
 * @param {string} data.questionOrder - RANDOM, BLUEPRINT, or FIXED
 * @param {string} data.optionOrder - RANDOM or FIXED
 * @param {string} data.notes - Optional notes
 * @returns {Promise<Object>} Generation results
 */
export const generateAllPapers = async (data) => {
  try {
    const response = await api.post(`${BASE_URL}/generate/all`, data);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get papers with pagination
 * GET /api/v1/candidate-papers
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.status - Filter by status
 * @param {string} params.instanceId - Filter by instance ID
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.candidateId - Filter by candidate ID
 * @returns {Promise<Object>} Paginated papers
 */
export const getPapers = async (params = {}) => {
  try {
    const response = await api.get(BASE_URL, { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get paper by ID
 * GET /api/v1/candidate-papers/:id
 * 
 * @param {string} paperId - Paper ID
 * @returns {Promise<Object>} Paper details
 */
export const getPaperById = async (paperId) => {
  try {
    const response = await api.get(`${BASE_URL}/${paperId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get papers by candidate
 * GET /api/v1/candidate-papers/candidate/:candidateId
 * 
 * @param {string} candidateId - Candidate ID
 * @param {Object} params - Query parameters
 * @param {string} params.instanceId - Filter by instance ID
 * @returns {Promise<Array>} Candidate papers
 */
export const getPapersByCandidate = async (candidateId, params = {}) => {
  try {
    const response = await api.get(`${BASE_URL}/candidate/${candidateId}`, { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Archive a paper
 * POST /api/v1/candidate-papers/:id/archive
 * 
 * @param {string} paperId - Paper ID
 * @param {string} reason - Archive reason
 * @returns {Promise<Object>} Archived paper
 */
export const archivePaper = async (paperId, reason = '') => {
  try {
    const response = await api.post(`${BASE_URL}/${paperId}/archive`, { reason });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  generatePaper,
  generateCentrePapers,
  generateAllPapers,
  getPapers,
  getPaperById,
  getPapersByCandidate,
  archivePaper,
};