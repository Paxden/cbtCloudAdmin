/**
 * Storage Utility
 * LocalStorage and SessionStorage helpers
 */

export const storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },

  /**
   * Get item from sessionStorage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  sessionGet: (key) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set item in sessionStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  sessionSet: (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error);
    }
  },

  /**
   * Remove item from sessionStorage
   * @param {string} key - Storage key
   */
  sessionRemove: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from sessionStorage:', error);
    }
  },
};

export default storage;