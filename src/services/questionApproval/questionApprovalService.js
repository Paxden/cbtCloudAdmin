/**
 * Question Approval Service - Cloud Admin
 * Handles API communication for Question Approval Workflow
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const QUESTIONS_URL = API_ENDPOINTS.QUESTION_BANK.QUESTIONS;
const REVIEWS_URL = API_ENDPOINTS.REVIEWS.BASE;

/**
 * Get review queue with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @param {string} params.categoryId - Filter by category
 * @param {string} params.subjectId - Filter by subject
 * @param {string} params.topicId - Filter by topic
 * @param {string} params.difficultyId - Filter by difficulty
 * @param {string} params.authorId - Filter by author
 * @param {string} params.reviewerId - Filter by reviewer
 * @param {string} params.search - Search term
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Paginated review queue
 */
export const getReviewQueue = async (params = {}) => {
  try {
    const response = await api.get(`${REVIEWS_URL}/queue`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a question for review by ID
 * @param {string} questionId - Question ID
 * @param {Object} options - Review options
 * @param {boolean} options.includeHistory - Include review history
 * @returns {Promise<Object>} Question data for review
 */
export const getQuestionForReview = async (questionId, options = {}) => {
  try {
    const { includeHistory = true } = options;
    const response = await api.get(`${REVIEWS_URL}/question/${questionId}`, {
      params: { includeHistory },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Submit a question for review
 * @param {string} questionId - Question ID
 * @param {Object} data - Submit data
 * @param {string} data.comment - Submission comment
 * @returns {Promise<Object>} Submit response
 */
export const submitForReview = async (questionId, data = {}) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/${questionId}/submit`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Approve a question
 * @param {string} questionId - Question ID
 * @param {Object} data - Approval data
 * @param {string} data.comment - Approval comment
 * @returns {Promise<Object>} Approval response
 */
export const approveQuestion = async (questionId, data = {}) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/${questionId}/approve`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk approve questions
 * @param {Array} questionIds - Array of question IDs
 * @param {Object} data - Approval data
 * @returns {Promise<Object>} Approval result
 */
export const bulkApproveQuestions = async (questionIds, data = {}) => {
  try {
    const response = await api.post('/api/v1/questions/bulk/approve', {
      questionIds,
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk reject questions
 * @param {Array} questionIds - Array of question IDs
 * @param {Object} data - Rejection data
 * @returns {Promise<Object>} Rejection result
 */
export const bulkRejectQuestions = async (questionIds, data = {}) => {
  try {
    const response = await api.post('/api/v1/questions/bulk/reject', {
      questionIds,
      ...data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


/**
 * Reject a question
 * @param {string} questionId - Question ID
 * @param {Object} data - Rejection data
 * @param {string} data.comment - Rejection comment (required)
 * @param {string} data.suggestions - Optional suggestions
 * @returns {Promise<Object>} Rejection response
 */
export const rejectQuestion = async (questionId, data = {}) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/${questionId}/reject`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get review history for a question
 * @param {string} questionId - Question ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Review history
 */
export const getReviewHistory = async (questionId, params = {}) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${questionId}/reviews`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get review statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Review statistics
 */
export const getReviewStatistics = async (params = {}) => {
  try {
    const response = await api.get(`${REVIEWS_URL}/statistics`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Assign reviewer to a question
 * @param {string} questionId - Question ID
 * @param {string} reviewerId - Reviewer user ID
 * @returns {Promise<Object>} Assignment response
 */
export const assignReviewer = async (questionId, reviewerId) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/${questionId}/assign-reviewer`, {
      reviewerId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getReviewQueue,
  getQuestionForReview,
  submitForReview,
  approveQuestion,
  bulkRejectQuestions,
  rejectQuestion,
  getReviewHistory,
  getReviewStatistics,
  assignReviewer,
};