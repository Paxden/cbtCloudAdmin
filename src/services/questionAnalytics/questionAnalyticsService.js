/* eslint-disable no-unused-vars */
/**
 * Question Analytics Service - Cloud Admin
 * Handles API communication for Question Analytics & Insights
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const STATISTICS_URL = `${API_ENDPOINTS.QUESTION_BANK.STATISTICS}`;
const QUESTIONS_URL = API_ENDPOINTS.QUESTION_BANK.QUESTIONS;

/**
 * Get dashboard overview statistics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboard = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/overview`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question growth analytics
 * @param {Object} params - Filter parameters
 * @param {string} params.interval - daily, monthly, yearly
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Growth analytics
 */
export const getGrowthAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/growth`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get status distribution analytics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Status analytics
 */
export const getStatusAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/status`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get category distribution analytics
 * @param {Object} params - Filter parameters
 * @param {number} params.limit - Maximum categories
 * @returns {Promise<Object>} Category analytics
 */
export const getCategoryAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/category`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get subject distribution analytics
 * @param {Object} params - Filter parameters
 * @param {string} params.categoryId - Filter by category
 * @param {number} params.limit - Maximum subjects
 * @returns {Promise<Object>} Subject analytics
 */
export const getSubjectAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/subject`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get topic distribution analytics
 * @param {Object} params - Filter parameters
 * @param {string} params.subjectId - Filter by subject
 * @param {number} params.limit - Maximum topics
 * @returns {Promise<Object>} Topic analytics
 */
export const getTopicAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/topic`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get difficulty distribution analytics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Difficulty analytics
 */
export const getDifficultyAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/difficulty`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get question type distribution analytics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Question type analytics
 */
export const getQuestionTypeAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/question-types`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get author performance analytics
 * @param {Object} params - Filter parameters
 * @param {number} params.limit - Maximum authors
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Author analytics
 */
export const getAuthorAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/authors`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get reviewer performance analytics
 * @param {Object} params - Filter parameters
 * @param {number} params.limit - Maximum reviewers
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Reviewer analytics
 */
export const getReviewerAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/reviewers`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get import analytics
 * @param {Object} params - Filter parameters
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Import analytics
 */
export const getImportAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/imports`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get media usage analytics
 * @param {Object} params - Filter parameters
 * @returns {Promise<Object>} Media analytics
 */
export const getMediaAnalytics = async (params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/media`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Export analytics data
 * @param {string} format - Export format (csv, excel, json)
 * @param {Object} params - Filter parameters
 * @returns {Promise<Blob>} Export blob
 */
export const exportAnalytics = async (format = 'csv', params = {}) => {
  try {
    const response = await api.get(`${STATISTICS_URL}/export`, {
      params: { format, ...params },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getDashboard,
  getGrowthAnalytics,
  getStatusAnalytics,
  getCategoryAnalytics,
  getSubjectAnalytics,
  getTopicAnalytics,
  getDifficultyAnalytics,
  getQuestionTypeAnalytics,
  getAuthorAnalytics,
  getReviewerAnalytics,
  getImportAnalytics,
  getMediaAnalytics,
  exportAnalytics,
};