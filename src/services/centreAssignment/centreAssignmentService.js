/**
 * Centre Assignment Service - Cloud Admin
 * Handles API communication for Centre Assignment
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';
const CENTRE_ASSIGNMENT_BASE = '/api/v1/centre-assignments';

// ============================================================
// CENTRE ASSIGNMENT OPERATIONS
// ============================================================

/**
 * Get centre assignments for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated assignments
 */
export const getAssignments = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/centre-assignments`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get centres available for an examination (assigned centres)
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Centres list
 */
export const getAvailableCentres = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/centres`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get location statistics for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {boolean} params.includeAssigned - Include assigned candidates
 * @returns {Promise<Object>} Location statistics
 */
export const getLocationStats = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/centres/location-stats`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get candidates by location for a centre
 * @param {string} examinationId - Examination ID
 * @param {string} centreId - Centre ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Candidates list
 */
export const getCandidatesByLocationForCentre = async (examinationId, centreId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/centres/${centreId}/candidates/by-location`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Assign a centre to an examination
 * @param {string} examinationId - Examination ID
 * @param {string} centreId - Centre ID
 * @param {Object} data - Assignment data
 * @returns {Promise<Object>} Assignment result
 */
export const assignCentreToExamination = async (examinationId, centreId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/centres`,
      { centreId, ...data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Assign candidates to a centre
 * @param {string} examinationId - Examination ID
 * @param {string} centreId - Centre ID
 * @param {Array} candidateIds - Array of candidate IDs
 * @param {Object} data - Assignment data
 * @returns {Promise<Object>} Assignment result
 */
export const assignCandidates = async (examinationId, centreId, candidateIds, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/centres/${centreId}/candidates`,
      { candidateIds, ...data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Auto assign candidates to centres
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Auto assignment data
 * @param {string} data.strategy - Assignment strategy (BALANCE, FILL, DISTRIBUTE, LOCATION_BASED)
 * @param {Array} data.centreIds - Specific centres to assign to
 * @param {Object} data.candidateFilter - Filter for candidates
 * @param {string} data.notes - Assignment notes
 * @param {boolean} data.preferLocation - Prefer location-based assignment
 * @param {boolean} data.fallbackToAny - Fallback to any centre if location match fails
 * @returns {Promise<Object>} Assignment result
 */
export const autoAssignCandidates = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/centres/auto-assign`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove a candidate assignment
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Removal data
 * @returns {Promise<Object>} Removal result
 */
export const removeAssignment = async (assignmentId, data = {}) => {
  try {
    const response = await api.delete(
      `${CENTRE_ASSIGNMENT_BASE}/${assignmentId}`,
      { data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove a centre assignment (remove all candidates from centre)
 * @param {string} assignmentId - Assignment ID
 * @param {Object} data - Removal data
 * @returns {Promise<Object>} Removal result
 */
export const removeCentreAssignment = async (assignmentId, data = {}) => {
  try {
    const response = await api.delete(
      `${CENTRE_ASSIGNMENT_BASE}/${assignmentId}/centre`,
      { data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Bulk remove assignments
 * @param {string} examinationId - Examination ID
 * @param {Array} assignmentIds - Array of assignment IDs
 * @param {Object} data - Removal data
 * @returns {Promise<Object>} Removal result
 */
export const bulkRemoveAssignments = async (examinationId, assignmentIds, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/centre-assignments/bulk-remove`,
      { assignmentIds, ...data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get assignment history
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated history
 */
export const getAssignmentHistory = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/centre-assignments/history`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get centre statistics for an examination
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Centre statistics
 */
export const getCentreStats = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/centre-assignments/stats`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get unassigned candidates for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Unassigned candidates
 */
export const getUnassignedCandidates = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/candidates/unassigned`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get candidates by location (unassigned)
 * @param {string} examinationId - Examination ID
 * @param {Object} location - Location filter
 * @param {string} location.city - City name
 * @param {string} location.state - State name
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Candidates list
 */
export const getUnassignedCandidatesByLocation = async (examinationId, location, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/candidates/unassigned/by-location`,
      { params, ...location }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================================
// BULK OPERATIONS
// ============================================================

/**
 * Bulk assign candidates to a centre
 * @param {string} examinationId - Examination ID
 * @param {string} centreId - Centre ID
 * @param {Array} candidateIds - Array of candidate IDs
 * @param {Object} data - Assignment data
 * @returns {Promise<Object>} Assignment result
 */
export const bulkAssignCandidates = async (examinationId, centreId, candidateIds, data = {}) => {
  // This is the same as assignCandidates, just for consistency
  return assignCandidates(examinationId, centreId, candidateIds, data);
};

export default {
  getAssignments,
  getAvailableCentres,
  getLocationStats,
  getCandidatesByLocationForCentre,
  assignCentreToExamination,
  assignCandidates,
  autoAssignCandidates,
  removeAssignment,
  removeCentreAssignment,
  bulkRemoveAssignments,
  getAssignmentHistory,
  getCentreStats,
  getUnassignedCandidates,
  getUnassignedCandidatesByLocation,
  bulkAssignCandidates,
};