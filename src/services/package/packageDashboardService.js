/**
 * Package Dashboard Service - Frontend
 *
 * Service responsibilities:
 * - Make API calls to backend endpoints
 * - Handle request/response transformation
 * - Error handling
 * - No business logic - only API communication
 *
 * Matches backend: /api/v1/package-dashboard
 */

import api from "../../config/axios";
import API_ENDPOINTS from "../../constants/apiEndpoints";

// Base URL for package dashboard endpoints
const BASE_URL = `${API_ENDPOINTS.BASE || "/api/v1"}/package-dashboard`;

/**
 * Sanitize parameters - remove undefined, null, empty string values
 */
const sanitizeParams = (params) => {
  if (!params) return {};

  const sanitized = {};
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      sanitized[key] = value;
    }
  });
  return sanitized;
};

/**
 * Handle API errors consistently
 */
const handleApiError = (error) => {
  console.error("Package Dashboard API Error:", error);

  if (error.response) {
    const { status, data } = error.response;
    let message = "An unexpected error occurred. Please try again.";

    switch (status) {
      case 400:
        message = data?.message || "Invalid request parameters.";
        break;
      case 401:
        message = "Your session has expired. Please log in again.";
        break;
      case 403:
        message = "You do not have permission to access this data.";
        break;
      case 404:
        message = "The requested resource was not found.";
        break;
      case 429:
        message = "Too many requests. Please wait and try again.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        message = data?.message || message;
    }

    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.data = data;
    throw formattedError;
  }

  if (error.request) {
    throw new Error("Network error. Please check your internet connection.");
  }

  throw error;
};

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Get dashboard overview
 * GET /api/v1/package-dashboard/overview
 *
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.fromDate - Start date (ISO format)
 * @param {string} params.toDate - End date (ISO format)
 * @returns {Promise<Object>} Dashboard overview data
 */
export const getDashboardOverview = async (params = {}) => {
  try {
    const validParams = {
      centreId: params.centreId,
      examId: params.examId,
      fromDate: params.fromDate,
      toDate: params.toDate,
    };

    const response = await api.get(`${BASE_URL}/overview`, {
      params: sanitizeParams(validParams),
    });

    // Backend returns { success: true, message: string, data: T }
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get status timeline
 * GET /api/v1/package-dashboard/timeline
 *
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {number} params.days - Number of days (default: 30)
 * @returns {Promise<Array>} Status timeline data
 */
export const getStatusTimeline = async (params = {}) => {
  try {
    const validParams = {
      centreId: params.centreId,
      examId: params.examId,
      days: params.days || 30,
    };

    const response = await api.get(`${BASE_URL}/timeline`, {
      params: sanitizeParams(validParams),
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get performance metrics
 * GET /api/v1/package-dashboard/performance
 *
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @returns {Promise<Object>} Performance metrics
 */
export const getPerformanceMetrics = async (params = {}) => {
  try {
    const validParams = {
      centreId: params.centreId,
      examId: params.examId,
    };

    const response = await api.get(`${BASE_URL}/performance`, {
      params: sanitizeParams(validParams),
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get centre statistics
 * GET /api/v1/package-dashboard/centres
 *
 * @param {Object} params - Query parameters
 * @param {string} params.examId - Filter by exam ID
 * @returns {Promise<Array>} Centre statistics
 */
export const getCentreStats = async (params = {}) => {
  try {
    const validParams = {
      examId: params.examId,
    };

    const response = await api.get(`${BASE_URL}/centres`, {
      params: sanitizeParams(validParams),
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get activity feed
 * GET /api/v1/package-dashboard/activity
 *
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {number} params.limit - Number of activities (default: 50)
 * @returns {Promise<Array>} Activity feed
 */
export const getActivityFeed = async (params = {}) => {
  try {
    const validParams = {
      centreId: params.centreId,
      examId: params.examId,
      limit: params.limit || 50,
    };

    const response = await api.get(`${BASE_URL}/activity`, {
      params: sanitizeParams(validParams),
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get package metrics
 * GET /api/v1/package-dashboard/packages/metrics
 *
 * @param {Object} params - Query parameters
 * @param {string} params.centreId - Filter by centre ID
 * @param {string} params.examId - Filter by exam ID
 * @param {string} params.status - Filter by status
 * @param {string} params.fromDate - Start date (ISO format)
 * @param {string} params.toDate - End date (ISO format)
 * @returns {Promise<Object>} Package metrics
 */
export const getPackageMetrics = async (params = {}) => {
  try {
    const validParams = {
      centreId: params.centreId,
      examId: params.examId,
      status: params.status,
      fromDate: params.fromDate,
      toDate: params.toDate,
    };

    const response = await api.get(`${BASE_URL}/packages/metrics`, {
      params: sanitizeParams(validParams),
    });

    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// ============================================================
// COMPATIBILITY EXPORTS
// ============================================================

export const getDashboardSummary = getDashboardOverview;
export const getPackageStatistics = getPerformanceMetrics;
export const getPackageTimeline = getStatusTimeline;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  getDashboardOverview,
  getStatusTimeline,
  getPerformanceMetrics,
  getCentreStats,
  getActivityFeed,
  getPackageMetrics,
  getDashboardSummary,
  getPackageStatistics,
  getPackageTimeline,
};
