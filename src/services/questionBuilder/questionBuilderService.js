/**
 * Question Builder Service
 * Handles API communication for question creation and editing
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const QUESTIONS_URL = API_ENDPOINTS.QUESTION_BANK.QUESTIONS;

/**
 * Create a new question (saves as DRAFT by default)
 * @param {Object} data - Question data
 * @returns {Promise<Object>} Created question
 */
export const createQuestion = async (data) => {
  try {
    const response = await api.post(QUESTIONS_URL, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update an existing question
 * @param {string} id - Question ID
 * @param {Object} data - Question data
 * @returns {Promise<Object>} Updated question
 */
export const updateQuestion = async (id, data) => {
  try {
    const response = await api.put(`${QUESTIONS_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get a question by ID (for editing)
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Question data
 */
export const getQuestion = async (id) => {
  try {
    const response = await api.get(`${QUESTIONS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Validate question before saving
 * @param {Object} data - Question data
 * @returns {Promise<Object>} Validation result
 */
export const validateQuestion = async (data) => {
  try {
    const response = await api.post(`${QUESTIONS_URL}/validate`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  createQuestion,
  updateQuestion,
  getQuestion,
  validateQuestion,
};