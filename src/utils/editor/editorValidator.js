/**
 * Editor Validator
 * Validates editor content before saving
 */

import { isContentEmpty, MAX_CONTENT_LENGTH } from './editorExtensions';
import { extractMathFormulas } from './mathExtension';

/**
 * Validate editor content
 * @param {Object} content - Editor content object
 * @param {string} html - HTML content
 * @param {Object} options - Validation options
 * @param {number} options.maxLength - Maximum content length
 * @param {boolean} options.requireContent - Whether content is required
 * @returns {Object} Validation result
 */
export const validateEditorContent = (content, html, options = {}) => {
  const {
    maxLength = MAX_CONTENT_LENGTH,
    requireContent = true,
  } = options;

  const errors = [];
  const warnings = [];

  // Check if content is empty
  if (requireContent && isContentEmpty(content)) {
    errors.push('Question content is required');
  }

  // Check content length
  if (html && html.length > maxLength) {
    errors.push(`Content exceeds maximum length of ${maxLength} characters`);
  }

  // Check for broken math formulas
  if (html) {
    const formulas = extractMathFormulas(html);
    const invalidFormulas = formulas.filter((f) => {
      // Check if formula is empty or contains invalid syntax
      return !f.formula || f.formula.trim().length < 2;
    });

    if (invalidFormulas.length > 0) {
      warnings.push(`Found ${invalidFormulas.length} invalid formula(s)`);
    }
  }

  // Check for unsafe HTML
  if (html) {
    const unsafePatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
    ];

    for (const pattern of unsafePatterns) {
      if (pattern.test(html)) {
        errors.push('Content contains unsafe HTML elements');
        break;
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Get content statistics
 * @param {string} html - HTML content
 * @returns {Object} Content statistics
 */
export const getContentStats = (html) => {
  if (!html) {
    return {
      characters: 0,
      words: 0,
      images: 0,
      tables: 0,
      formulas: 0,
    };
  }

  // Remove HTML tags to count text
  const textOnly = html.replace(/<[^>]*>/g, ' ').trim();
  const words = textOnly.split(/\s+/).filter((w) => w.length > 0);

  // Count images
  const images = (html.match(/<img[^>]*>/g) || []).length;

  // Count tables
  const tables = (html.match(/<table[^>]*>/g) || []).length;

  // Count formulas
  const formulas = (html.match(/<span[^>]*data-type="math"[^>]*>/g) || []).length;

  return {
    characters: textOnly.length,
    words: words.length,
    images,
    tables,
    formulas,
  };
};