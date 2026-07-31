/**
 * Centre Service - Cloud Admin
 * Handles API communication for Centre Management
 */

import api from "../../config/axios";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const CENTRES_URL = API_ENDPOINTS.CENTRES?.BASE || "/api/v1/centres";

/**
 * Get all centres with pagination and filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated centres
 */
export const getCentres = async (params = {}) => {
  try {
    const response = await api.get(CENTRES_URL, { params });
    console.log("📋 getCentres raw response:", response);
    console.log("📋 getCentres data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ getCentres error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Get centre statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Centre statistics
 */
export const getCentreStats = async (params = {}) => {
  try {
    // ✅ Try the stats endpoint first
    const response = await api.get(`${CENTRES_URL}/stats`, { params });
    console.log("📊 getCentreStats response:", response.data);

    // If the stats endpoint works, return it
    if (response.data && response.data.success) {
      return response.data;
    }

    // If stats endpoint returns data directly
    if (response.data && !response.data.success) {
      // Check if it has the stats data
      if (response.data.total !== undefined) {
        return {
          success: true,
          data: response.data,
        };
      }
    }

    // ✅ Fallback: Calculate stats from the centres endpoint
    console.log("📊 Stats endpoint not available, calculating from centres...");
    const centresResponse = await api.get(CENTRES_URL, {
      params: {
        limit: 1000, // Get all centres
        ...params,
      },
    });

    let centres = [];
    let total = 0;

    // Extract centres from response
    if (centresResponse.data && centresResponse.data.success) {
      const data = centresResponse.data.data;
      if (Array.isArray(data)) {
        centres = data;
        total = data.length;
      } else if (data && data.data && Array.isArray(data.data)) {
        centres = data.data;
        total = data.pagination?.total || centres.length;
      } else if (data && data.pagination) {
        total = data.pagination.total || 0;
        centres = data.data || [];
      }
    } else if (Array.isArray(centresResponse.data)) {
      centres = centresResponse.data;
      total = centres.length;
    } else if (centresResponse.data && centresResponse.data.data) {
      centres = centresResponse.data.data || [];
      total = centresResponse.data.total || centres.length;
    }

    // Calculate statistics
    const stats = {
      total: total || centres.length || 0,
      active: centres.filter((c) => c.status === "ACTIVE").length,
      inactive: centres.filter((c) => c.status === "INACTIVE").length,
      pending: centres.filter((c) => c.status === "PENDING").length,
      totalCapacity: centres.reduce((sum, c) => sum + (c.capacity || 0), 0),
      usedCapacity: centres.reduce(
        (sum, c) => sum + (c.assignedCandidates || 0),
        0,
      ),
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("❌ getCentreStats error:", error);
    // Return default stats object
    return {
      success: false,
      data: {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
        totalCapacity: 0,
        usedCapacity: 0,
      },
    };
  }
};

/**
 * Get centre by ID
 * @param {string} id - Centre ID
 * @returns {Promise<Object>} Centre details
 */
export const getCentre = async (id) => {
  try {
    const response = await api.get(`${CENTRES_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new centre
 * @param {Object} data - Centre data
 * @param {string} data.name - Centre name
 * @param {string} data.code - Centre code
 * @param {string} data.address - Centre address
 * @param {number} data.capacity - Centre capacity
 * @param {string} data.manager - Manager user ID
 * @param {string} data.status - Centre status
 * @returns {Promise<Object>} Created centre
 */
export const createCentre = async (data) => {
  try {
    const response = await api.post(CENTRES_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update centre
 * @param {string} id - Centre ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated centre
 */
export const updateCentre = async (id, data) => {
  try {
    const response = await api.put(`${CENTRES_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete centre (soft delete)
 * @param {string} id - Centre ID
 * @returns {Promise<Object>} Deleted centre
 */
export const deleteCentre = async (id) => {
  try {
    const response = await api.delete(`${CENTRES_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Activate centre
 * @param {string} id - Centre ID
 * @returns {Promise<Object>} Activated centre
 */
export const activateCentre = async (id) => {
  try {
    const response = await api.patch(`${CENTRES_URL}/${id}/activate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate centre
 * @param {string} id - Centre ID
 * @returns {Promise<Object>} Deactivated centre
 */
export const deactivateCentre = async (id) => {
  try {
    const response = await api.patch(`${CENTRES_URL}/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Assign manager to centre
 * @param {string} id - Centre ID
 * @param {string} managerId - User ID of manager
 * @returns {Promise<Object>} Updated centre
 */
export const assignManager = async (id, managerId) => {
  try {
    const response = await api.patch(`${CENTRES_URL}/${id}/manager`, {
      managerId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get available centres (for assignment)
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Available centres
 */
export const getAvailableCentres = async (examinationId) => {
  try {
    const response = await api.get(`${CENTRES_URL}/available`, {
      params: { examinationId },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getCentres,
  getCentre,
  createCentre,
  updateCentre,
  deleteCentre,
  activateCentre,
  deactivateCentre,
  assignManager,
  getCentreStats,
  getAvailableCentres,
};
