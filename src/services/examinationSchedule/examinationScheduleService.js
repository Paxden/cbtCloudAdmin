/**
 * Examination Schedule Service - Cloud Admin
 * Handles API communication for Examination Scheduling & Session Management
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get all sessions for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Filter by status
 * @param {string} params.centreId - Filter by centre
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @returns {Promise<Object>} Paginated sessions
 */
export const getSessions = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/sessions`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a single session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session details
 */
export const getSession = async (sessionId) => {
  try {
    const response = await api.get(`/api/v1/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new session
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Session data
 * @param {string} data.name - Session name
 * @param {string} data.centreId - Centre ID
 * @param {Date} data.date - Session date
 * @param {string} data.startTime - Start time (HH:MM)
 * @param {string} data.endTime - End time (HH:MM)
 * @param {number} data.maxCandidates - Maximum candidates
 * @param {string} data.notes - Notes
 * @returns {Promise<Object>} Created session
 */
export const createSession = async (examinationId, data) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/sessions`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing session
 * @param {string} sessionId - Session ID
 * @param {Object} data - Session data
 * @returns {Promise<Object>} Updated session
 */
export const updateSession = async (sessionId, data) => {
  try {
    const response = await api.put(
      `/api/v1/sessions/${sessionId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete a session
 * @param {string} sessionId - Session ID
 * @param {Object} data - Delete data
 * @param {string} data.reason - Deletion reason
 * @returns {Promise<Object>} Deleted session
 */
export const deleteSession = async (sessionId, data = {}) => {
  try {
    const response = await api.delete(
      `/api/v1/sessions/${sessionId}`,
      { data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Cancel a session
 * @param {string} sessionId - Session ID
 * @param {Object} data - Cancel data
 * @param {string} data.reason - Cancellation reason
 * @returns {Promise<Object>} Cancelled session
 */
export const cancelSession = async (sessionId, data = {}) => {
  try {
    const response = await api.patch(
      `/api/v1/sessions/${sessionId}/cancel`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Schedule a session (DRAFT -> SCHEDULED)
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Scheduled session
 */
export const scheduleSession = async (sessionId) => {
  try {
    const response = await api.patch(
      `/api/v1/sessions/${sessionId}/schedule`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Publish all sessions for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Publish data
 * @param {string} data.comments - Comments
 * @returns {Promise<Object>} Publish result
 */
export const publishSchedule = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/sessions/publish`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Validate schedule
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Validation result
 */
export const validateSchedule = async (examinationId) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/sessions/validate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get calendar view data
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {string} params.view - Calendar view (month, week, day)
 * @param {string} params.date - Date reference
 * @param {string} params.centreId - Filter by centre
 * @returns {Promise<Object>} Calendar data
 */
export const getCalendar = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/sessions/calendar`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get session statistics
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Statistics
 */
export const getSessionStats = async (examinationId) => {
  try {
    const response = await api.get(
      `/api/v1/sessions/stats`,
      { params: { examinationId } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  cancelSession,
  scheduleSession,
  publishSchedule,
  validateSchedule,
  getCalendar,
  getSessionStats,
};