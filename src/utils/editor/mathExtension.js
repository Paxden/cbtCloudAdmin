/**
 * Math Extension for TipTap
 * Adds KaTeX formula support
 */

import { Node } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/**
 * Math node extension
 */
export const MathExtension = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      value: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-value'),
        renderHTML: (attributes) => ({
          'data-value': attributes.value,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', { 'data-type': 'math', ...HTMLAttributes }, HTMLAttributes.value];
  },

  addCommands() {
    return {
      insertMath: (value) => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: { value },
          })
          .run();
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('math'),
        props: {
          handleDOMEvents: {
            click: (view, event) => {
              const target = event.target;
              if (target.closest?.('[data-type="math"]')) {
                // Handle math element click
                return false;
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});

/**
 * Render math formula to HTML
 * @param {string} formula - LaTeX formula
 * @returns {string} HTML string
 */
export const renderMath = (formula) => {
  if (!formula) return '';
  return `<span data-type="math" data-value="${encodeURIComponent(formula)}">${formula}</span>`;
};

/**
 * Extract math formulas from HTML
 * @param {string} html - HTML content
 * @returns {Array} Array of formulas
 */
export const extractMathFormulas = (html) => {
  if (!html) return [];
  
  const regex = /<span[^>]*data-type="math"[^>]*data-value="([^"]*)"[^>]*>/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    matches.push({
      formula: decodeURIComponent(match[1]),
      html: match[0],
    });
  }
  
  return matches;
};