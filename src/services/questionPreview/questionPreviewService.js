/**
 * Question Preview Service - Cloud Admin
 * Handles question rendering and preview
 */

import api from '../../config/axios';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

const PREVIEW_URL = `${API_ENDPOINTS.QUESTION_BANK.PREVIEW}`;

/**
 * Load a question for preview
 * @param {string} questionId - Question ID
 * @param {Object} options - Preview options
 * @param {string} options.version - Version number (optional)
 * @param {string} options.mode - Preview mode (candidate, examiner)
 * @returns {Promise<Object>} Question preview data
 */
export const loadQuestion = async (questionId, options = {}) => {
  try {
    const { version, mode = 'candidate' } = options;
    const params = { mode };
    if (version) {
      params.version = version;
    }

    const response = await api.get(`${PREVIEW_URL}/${questionId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Render question content
 * @param {Object} question - Question data
 * @param {Object} options - Render options
 * @param {string} options.mode - Preview mode
 * @param {boolean} options.showAnswers - Show correct answers
 * @param {boolean} options.showExplanation - Show explanation
 * @param {boolean} options.showReference - Show reference
 * @param {boolean} options.showMetadata - Show metadata
 * @returns {Object} Rendered question data
 */
export const renderQuestion = (question, options = {}) => {
  const {
    mode = 'candidate',
    showAnswers = false,
    showExplanation = false,
    showReference = false,
    showMetadata = false,
  } = options;

  // Clone question to avoid mutations
  const rendered = { ...question };

  // Filter sensitive data based on mode
  if (mode === 'candidate') {
    delete rendered.correctAnswer;
    delete rendered.explanation;
    delete rendered.reference;
  }

  // Apply display options
  rendered.displayOptions = {
    showAnswers,
    showExplanation,
    showReference,
    showMetadata,
  };

  // Sanitize HTML content
  if (rendered.questionText) {
    rendered.questionText = sanitizeHtml(rendered.questionText);
  }

  if (rendered.explanation) {
    rendered.explanation = sanitizeHtml(rendered.explanation);
  }

  return rendered;
};

/**
 * Validate question render
 * @param {Object} question - Question data
 * @returns {Object} Validation result
 */
export const validateQuestionRender = (question) => {
  const errors = [];
  const warnings = [];

  if (!question) {
    errors.push('No question data provided');
    return { isValid: false, errors, warnings };
  }

  // Check required fields
  if (!question.questionText || question.questionText.trim() === '') {
    errors.push('Question text is required');
  }

  // Validate based on question type
  const typeCode = question.questionTypeId?.code || question.questionType;
  if (typeCode === 'SINGLE_CHOICE' || typeCode === 'MULTIPLE_CHOICE') {
    if (!question.options || question.options.length < 2) {
      errors.push('Question must have at least 2 options');
    }
  }

  if (typeCode === 'TRUE_FALSE') {
    if (question.correctAnswer === undefined || question.correctAnswer === null) {
      errors.push('True/False question must have a correct answer');
    }
  }

  if (typeCode === 'FILL_BLANK') {
    if (!question.correctAnswer || question.correctAnswer.length === 0) {
      errors.push('Fill in the Blank question must have accepted answers');
    }
  }

  // Check for empty options
  if (question.options) {
    const emptyOptions = question.options.filter(
      (opt) => !opt.text || opt.text.trim() === ''
    );
    if (emptyOptions.length > 0) {
      warnings.push(`${emptyOptions.length} option(s) have empty text`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content
 * @returns {string} Sanitized HTML
 */
const sanitizeHtml = (html) => {
  if (!html) return '';
  
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove onclick, onerror, etc.
  sanitized = sanitized.replace(/\s*on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+='[^']*'/gi, '');
  
  // Remove javascript: links
  sanitized = sanitized.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  sanitized = sanitized.replace(/href='javascript:[^']*'/gi, "href='#'");
  
  return sanitized;
};

export default {
  loadQuestion,
  renderQuestion,
  validateQuestionRender,
};