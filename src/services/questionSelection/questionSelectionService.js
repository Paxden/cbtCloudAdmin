/**
 * Question Selection Service - Cloud Admin
 * Handles API communication for Question Selection & Paper Composition
 */

import api from '../../config/axios';

const BASE_URL = '/api/v1/examinations';

/**
 * Get paper composition for an examination
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {boolean} params.includeSnapshots - Include question snapshots
 * @param {string} params.status - Filter by status
 * @returns {Promise<Object>} Paper composition
 */
export const getComposition = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/paper`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Generate a paper composition
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Generation data
 * @param {string} data.randomSeed - Random seed for reproducibility
 * @param {Object} data.reusePolicy - Question reuse policy
 * @param {Object} data.options - Additional options
 * @returns {Promise<Object>} Generated paper
 */
export const generatePaper = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/paper`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Regenerate a paper composition
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Regeneration data
 * @param {string} data.randomSeed - New random seed
 * @param {Object} data.options - Additional options
 * @returns {Promise<Object>} Regenerated paper
 */
export const regeneratePaper = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/paper/regenerate`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get available questions for selection
 * @param {string} examinationId - Examination ID
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.subjectId - Filter by subject
 * @param {string} params.topicId - Filter by topic
 * @param {string} params.difficulty - Filter by difficulty
 * @param {string} params.questionType - Filter by question type
 * @param {string} params.sectionId - Filter by section
 * @returns {Promise<Object>} Available questions
 */
export const getAvailableQuestions = async (examinationId, params = {}) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/paper/questions/available`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Select a question for the paper
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Selection data
 * @param {string} data.questionId - Question ID
 * @param {string} data.sectionId - Section ID
 * @param {number} data.marks - Marks for the question
 * @param {number} data.displayOrder - Display order
 * @returns {Promise<Object>} Updated paper
 */
export const selectQuestion = async (examinationId, data) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/paper/questions`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Replace a question in the paper
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Replacement data
 * @param {string} data.questionId - New question ID
 * @param {string} data.oldQuestionId - Old question ID to replace
 * @param {string} data.sectionId - Section ID
 * @param {number} data.marks - Marks for the question
 * @returns {Promise<Object>} Updated paper
 */
export const replaceQuestion = async (examinationId, data) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/paper/questions/replace`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Remove a question from the paper
 * @param {string} examinationId - Examination ID
 * @param {string} questionId - Question ID to remove
 * @param {Object} data - Removal data
 * @param {string} data.reason - Removal reason
 * @returns {Promise<Object>} Updated paper
 */
export const removeQuestion = async (examinationId, questionId, data = {}) => {
  try {
    const response = await api.delete(
      `${BASE_URL}/${examinationId}/paper/questions/${questionId}`,
      { data }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Lock a question in the paper
 * @param {string} examinationId - Examination ID
 * @param {string} questionId - Question ID to lock
 * @returns {Promise<Object>} Updated paper
 */
export const lockQuestion = async (examinationId, questionId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/paper/questions/${questionId}/lock`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Unlock a question in the paper
 * @param {string} examinationId - Examination ID
 * @param {string} questionId - Question ID to unlock
 * @returns {Promise<Object>} Updated paper
 */
export const unlockQuestion = async (examinationId, questionId) => {
  try {
    const response = await api.patch(
      `${BASE_URL}/${examinationId}/paper/questions/${questionId}/unlock`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Validate the paper composition
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Validation result
 */
export const validateComposition = async (examinationId) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/paper/validate`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Publish the paper composition
 * @param {string} examinationId - Examination ID
 * @param {Object} data - Publish data
 * @param {string} data.comments - Publication comments
 * @returns {Promise<Object>} Published paper
 */
export const publishComposition = async (examinationId, data = {}) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${examinationId}/paper/publish`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get paper statistics
 * @param {string} examinationId - Examination ID
 * @returns {Promise<Object>} Paper statistics
 */
export const getPaperStats = async (examinationId) => {
  try {
    const response = await api.get(
      `${BASE_URL}/${examinationId}/paper/stats`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  getComposition,
  generatePaper,
  regeneratePaper,
  getAvailableQuestions,
  selectQuestion,
  replaceQuestion,
  removeQuestion,
  lockQuestion,
  unlockQuestion,
  validateComposition,
  publishComposition,
  getPaperStats,
};