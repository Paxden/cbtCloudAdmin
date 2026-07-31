/* eslint-disable no-unused-vars */
/**
 * Question Search Service - Cloud Admin
 * Handles advanced search and filtering for questions
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const SEARCH_URL = `${API_ENDPOINTS.QUESTION_BANK.SEARCH}`;
const QUESTIONS_URL = API_ENDPOINTS.QUESTION_BANK.QUESTIONS;

// Local storage key for saved searches (fallback when backend not available)
const SAVED_SEARCHES_KEY = 'cbt_saved_searches';

/**
 * Search questions with advanced filters
 * @param {Object} params - Search parameters
 * @param {string} params.keyword - Search keyword
 * @param {Array} params.categories - Array of category IDs
 * @param {Array} params.subjects - Array of subject IDs
 * @param {Array} params.topics - Array of topic IDs
 * @param {Array} params.questionTypes - Array of question type IDs
 * @param {Array} params.difficulties - Array of difficulty IDs
 * @param {Array} params.statuses - Array of statuses
 * @param {string} params.dateFrom - Start date
 * @param {string} params.dateTo - End date
 * @param {number} params.marksFrom - Minimum marks
 * @param {number} params.marksTo - Maximum marks
 * @param {string} params.createdBy - Author ID
 * @param {boolean} params.hasImages - Filter by images
 * @param {boolean} params.hasFormulas - Filter by formulas
 * @param {boolean} params.hasTables - Filter by tables
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {boolean} params.includeDeleted - Include deleted
 * @returns {Promise<Object>} Search results
 */
export const searchQuestions = async (params = {}) => {
  try {
    // Build query params
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(','));
        } else if (!Array.isArray(value)) {
          queryParams.append(key, value);
        }
      }
    });

    const url = `${QUESTIONS_URL}?${queryParams.toString()}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get search suggestions
 * @param {string} keyword - Search keyword
 * @param {string} field - Field to get suggestions from
 * @param {number} limit - Maximum suggestions
 * @returns {Promise<Object>} Suggestions
 */
export const getSearchSuggestions = async (keyword, field = 'questionText', limit = 10) => {
  try {
    const response = await api.get(`${SEARCH_URL}/suggestions`, {
      params: { keyword, field, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get search filters data (categories, subjects, topics, types, difficulties)
 * @returns {Promise<Object>} Filter data
 */
export const getSearchFilters = async () => {
  try {
    const response = await api.get(`${SEARCH_URL}/filters`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Save a search (uses localStorage if backend not available)
 * @param {Object} searchData - Search data
 * @param {string} searchData.name - Search name
 * @param {Object} searchData.filters - Filter object
 * @param {string} searchData.description - Search description
 * @returns {Promise<Object>} Saved search
 */
export const saveSearch = async (searchData) => {
  try {
    // Try backend first
    const response = await api.post(`${QUESTIONS_URL}/saved-searches`, searchData);
    return response.data;
  } catch (error) {
    // Fallback to localStorage
    const savedSearches = getLocalSavedSearches();
    const newSearch = {
      id: `local_${Date.now()}`,
      ...searchData,
      createdAt: new Date().toISOString(),
      isLocal: true,
    };
    savedSearches.unshift(newSearch);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(savedSearches));
    return { success: true, data: newSearch };
  }
};

/**
 * Get saved searches
 * @returns {Promise<Object>} Saved searches
 */
export const getSavedSearches = async () => {
  try {
    // Try backend first
    const response = await api.get(`${QUESTIONS_URL}/saved-searches`);
    return response.data;
  } catch (error) {
    // Fallback to localStorage
    const savedSearches = getLocalSavedSearches();
    return { success: true, data: savedSearches };
  }
};

/**
 * Delete a saved search
 * @param {string} id - Search ID
 * @returns {Promise<Object>} Delete response
 */
export const deleteSavedSearch = async (id) => {
  try {
    const response = await api.delete(`${QUESTIONS_URL}/saved-searches/${id}`);
    return response.data;
  } catch (error) {
    // Fallback to localStorage
    const savedSearches = getLocalSavedSearches();
    const filtered = savedSearches.filter((s) => s.id !== id);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(filtered));
    return { success: true };
  }
};

/**
 * Get saved searches from localStorage
 * @returns {Array} Saved searches
 */
const getLocalSavedSearches = () => {
  try {
    const data = localStorage.getItem(SAVED_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Get search history from localStorage
 * @param {number} limit - Maximum items
 * @returns {Array} Search history
 */
export const getSearchHistory = (limit = 10) => {
  try {
    const data = localStorage.getItem('cbt_search_history');
    const history = data ? JSON.parse(data) : [];
    return history.slice(0, limit);
  } catch {
    return [];
  }
};

/**
 * Add search to history
 * @param {Object} searchData - Search data
 */
export const addToSearchHistory = (searchData) => {
  try {
    const history = getSearchHistory(100);
    const newEntry = {
      ...searchData,
      timestamp: new Date().toISOString(),
      id: Date.now(),
    };
    // Remove duplicate if same filters
    const filtered = history.filter((h) => {
      return JSON.stringify(h.filters) !== JSON.stringify(searchData.filters);
    });
    filtered.unshift(newEntry);
    localStorage.setItem('cbt_search_history', JSON.stringify(filtered));
  } catch {
    // Ignore
  }
};

/**
 * Clear search history
 */
export const clearSearchHistory = () => {
  try {
    localStorage.removeItem('cbt_search_history');
  } catch {
    // Ignore
  }
};

export default {
  searchQuestions,
  getSearchSuggestions,
  getSearchFilters,
  saveSearch,
  getSavedSearches,
  deleteSavedSearch,
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
};