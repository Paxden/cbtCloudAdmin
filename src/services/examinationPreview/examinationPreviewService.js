/**
 * Examination Preview Service - Cloud Admin
 * Handles API communication for Examination Preview & Readiness Dashboard
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get complete examination preview
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Complete preview data
 */
export const getPreview = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/preview`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get readiness dashboard
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Readiness data
 */
export const getReadiness = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/readiness`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get readiness checklist
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Checklist data
 */
export const getChecklist = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/readiness/check`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Approve examination for validation
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Approval data
 * @param {string} data.comments - Approval comments
 * @returns {Promise<Object>} Approval result
 */
export const approvePreview = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/preview/approve`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Export preview report
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Export parameters
 * @param {string} params.format - Export format (pdf, csv, excel)
 * @param {string} params.sections - Sections to include
 * @returns {Promise<Blob>} Export file
 */
export const exportPreview = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/preview/export`,
      {
        params,
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get preview statistics
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Preview statistics
 */
export const getPreviewStats = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/preview/stats`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getPreview,
  getReadiness,
  getChecklist,
  approvePreview,
  exportPreview,
  getPreviewStats,
};