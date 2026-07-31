/**
 * Candidate Import Service - Cloud Admin
 * Handles API communication for Candidate Import
 */

import api from "../../config/axios";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const BASE_URL = "/api/v1/examinations";

/**
 * Get import history
 * @param {Object} params - Query parameters
 * @param {string} params.examinationId - Filter by examination
 * @param {string} params.status - Filter by status
 * @param {string} params.importedBy - Filter by user
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} Paginated import history
 */
export const getImportHistory = async (params = {}) => {
  try {
    // ✅ CORRECT - Use API_ENDPOINTS.CANDIDATE_IMPORT.HISTORY
    const response = await api.get(
      API_ENDPOINTS.CANDIDATE_IMPORT.HISTORY, // This is a string: "/api/v1/candidate-import/history"
      { params },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Download error report
 * @param {string} importId - Import ID
 * @param {string} format - Report format (csv, xlsx)
 * @returns {Promise<Blob>} Error report file
 */
export const downloadErrorReport = async (importId, format = "csv") => {
  try {
    // ✅ CORRECT - Use API_ENDPOINTS.CANDIDATE_IMPORT.ERRORS
    const response = await api.get(
      API_ENDPOINTS.CANDIDATE_IMPORT.ERRORS(importId),
      {
        params: { format },
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get import summary
 * @param {string} importId - Import ID
 * @returns {Promise<Object>} Import summary
 */
export const getImportSummary = async (importId) => {
  try {
    // ✅ CORRECT - Use API_ENDPOINTS.CANDIDATE_IMPORT.SUMMARY
    const response = await api.get(
      API_ENDPOINTS.CANDIDATE_IMPORT.SUMMARY(importId),
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Rest of the functions remain the same...
export const downloadTemplate = async (examinationId, format = "xlsx") => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/candidates/import/template`,
      {
        params: { format },
        responseType: "blob",
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const uploadCandidateFile = async (examinationId, formData, onProgress) => {
  try {
    console.log('📤 Sending upload request:', {
      examinationId,
      formDataEntries: Array.from(formData.entries()).map(([key, value]) => {
        if (value instanceof File) {
          return [key, { name: value.name, size: value.size, type: value.type }];
        }
        return [key, value];
      })
    });

    const response = await api.post(
      `${BASE_URL}/${examinationId}/candidates/import/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );
    
    console.log('📥 Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Upload service error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error.response?.data || error;
  }
};

export const previewImport = async (examinationId, fileId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/candidates/import/preview/${fileId}`,
      { params },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const validateImport = async (examinationId, fileId) => {
  try {
    console.log("🔍 Validating:", { examinationId, fileId });

    const response = await api.post(
      `${BASE_URL}/${examinationId}/candidates/import/validate/${fileId}`,
    );

    console.log("📥 Validate response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Validate error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    throw error.response?.data || error;
  }
};

export const commitImport = async (examinationId, fileId, options = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/candidates/import/commit/${fileId}`,
      options,
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  downloadTemplate,
  getImportHistory,
  uploadCandidateFile,
  previewImport,
  validateImport,
  commitImport,
  downloadErrorReport,
  getImportSummary,
};