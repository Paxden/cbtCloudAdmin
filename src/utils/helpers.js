/**
 * General Helpers
 * Reusable utility functions
 */

import dayjs from 'dayjs';
import { APP_CONSTANTS } from '../constants/appConstants';

/**
 * Format date to display format
 * @param {string|Date} date - Date to format
 * @param {string} format - Date format (optional)
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = APP_CONSTANTS.DATE_FORMAT) => {
  if (!date) return '-';
  return dayjs(date).format(format);
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format(APP_CONSTANTS.DATE_TIME_FORMAT);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Get status color from status code
 * @param {string} status - Status code
 * @returns {string} Color hex
 */
export const getStatusColor = (status) => {
  return APP_CONSTANTS.STATUS_COLORS[status] || '#9e9e9e';
};

/**
 * Get status label from status code
 * @param {string} status - Status code
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  return APP_CONSTANTS.STATUS_LABELS[status] || status;
};

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @param {number} max - Maximum initials
 * @returns {string} Initials
 */
export const getInitials = (name, max = 2) => {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts
    .slice(0, max)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

/**
 * Get avatar color from name
 * @param {string} name - Name
 * @returns {string} Color
 */
export const getAvatarColor = (name) => {
  const colors = [
    '#1976d2', '#2e7d32', '#d32f2f', '#ed6c02',
    '#9c27b0', '#0288d1', '#00796b', '#e65100',
  ];
  if (!name) return colors[0];
  const index = name.length % colors.length;
  return colors[index];
};

/**
 * Create URL-friendly slug
 * @param {string} text - Text to slugify
 * @returns {string} Slug
 */
export const slugify = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - Filename
 * @returns {string} Extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};