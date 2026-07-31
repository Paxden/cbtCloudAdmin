/**
 * Token Utility
 * JWT token management helpers
 */

import { env } from '../config/env';
import { storage } from './storage';

export const tokenHelper = {
  /**
   * Get access token from storage
   * @returns {string|null} Access token
   */
  getAccessToken: () => {
    return storage.get(env.tokenKey);
  },

  /**
   * Set access token in storage
   * @param {string} token - Access token
   */
  setAccessToken: (token) => {
    storage.set(env.tokenKey, token);
  },

  /**
   * Get refresh token from storage
   * @returns {string|null} Refresh token
   */
  getRefreshToken: () => {
    return storage.get(env.refreshTokenKey);
  },

  /**
   * Set refresh token in storage
   * @param {string} token - Refresh token
   */
  setRefreshToken: (token) => {
    storage.set(env.refreshTokenKey, token);
  },

  /**
   * Get user from storage
   * @returns {Object|null} User object
   */
  getUser: () => {
    return storage.get(env.userKey);
  },

  /**
   * Set user in storage
   * @param {Object} user - User object
   */
  setUser: (user) => {
    storage.set(env.userKey, user);
  },

  /**
   * Clear all tokens and user data
   */
  clearTokens: () => {
    storage.remove(env.tokenKey);
    storage.remove(env.refreshTokenKey);
    storage.remove(env.userKey);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!storage.get(env.tokenKey);
  },

  /**
   * Get auth header for requests
   * @returns {Object} Authorization header
   */
  getAuthHeader: () => {
    const token = storage.get(env.tokenKey);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default tokenHelper;