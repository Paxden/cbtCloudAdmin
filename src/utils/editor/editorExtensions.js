/**
 * Editor Extensions Configuration
 * TipTap extensions setup for the question editor
 */

import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
// ✅ Fixed: TextStyle doesn't have a default export
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import { MathExtension } from './mathExtension';

/**
 * Maximum content size in characters
 */
export const MAX_CONTENT_LENGTH = 10000;

/**
 * Get all editor extensions
 * @param {Object} options - Configuration options
 * @param {string} options.placeholder - Placeholder text
 * @param {number} options.maxLength - Maximum content length
 * @returns {Array} TipTap extensions
 */
export const getEditorExtensions = (options = {}) => {
  const {
    placeholder = 'Write your question content here...',
    maxLength = MAX_CONTENT_LENGTH,
  } = options;

  return [
    // StarterKit includes: Bold, Italic, Heading, Paragraph, List, Blockquote, Code, HardBreak, HorizontalRule
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),

    // Link
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),

    // Image
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),

    // Table
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,

    // Text Alignment
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),

    // Text Formatting
    Underline,
    Strike,
    Subscript,
    Superscript,
    CodeBlock,

    // Text Color - ✅ Fixed: TextStyle must come before Color
    TextStyle,
    Color.configure({
      types: ['textStyle'],
    }),
    Highlight.configure({
      multicolor: true,
    }),

    // Mathematics
    MathExtension,

    // Placeholder
    Placeholder.configure({
      placeholder,
      emptyEditorClass: 'is-editor-empty',
    }),

    // Character Count
    CharacterCount.configure({
      limit: maxLength,
    }),
  ];
};

/**
 * Get the default editor content
 * @param {string} initialContent - Initial HTML content
 * @returns {Object} Editor content object
 */
export const getDefaultEditorContent = (initialContent = '') => {
  return {
    type: 'doc',
    content: initialContent ? [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: initialContent,
          },
        ],
      },
    ] : [
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
};

/**
 * Check if content is empty
 * @param {Object} content - Editor content
 * @returns {boolean} True if content is empty
 */
export const isContentEmpty = (content) => {
  if (!content) return true;
  if (typeof content === 'string') {
    return content.trim().length === 0 || content === '<p></p>';
  }
  if (content.content) {
    return content.content.every((node) => {
      if (node.type === 'paragraph' && node.content) {
        return node.content.every((child) => !child.text);
      }
      return false;
    });
  }
  return true;
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML content
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
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