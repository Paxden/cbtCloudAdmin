/**
 * Navigation Constants
 * Navigation helpers and utilities
 * Imports menu items from separate file to avoid circular dependencies
 */

import { MENU_ITEMS } from './menuItems';

// ✅ Re-export MENU_ITEMS from menuItems
export { MENU_ITEMS };

/**
 * Get breadcrumb label for a path
 */
export const getBreadcrumbLabel = (path) => {
  const segments = path.split('/').filter(Boolean);
  const labels = {
    dashboard: 'Dashboard',
    'question-bank': 'Question Bank',
    categories: 'Categories',
    subjects: 'Subjects',
    topics: 'Topics',
    'difficulty-levels': 'Difficulty Levels',
    'question-types': 'Question Types',
    questions: 'Questions',
    media: 'Media Library',
    import: 'Bulk Import',
    search: 'Search',
    statistics: 'Statistics',
    reviews: 'Reviews',
    exams: 'Exams',
    candidates: 'Candidates',
    centres: 'Centres',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'Profile',
    'change-password': 'Change Password',
  };

  const lastSegment = segments[segments.length - 1];
  return labels[lastSegment] || lastSegment?.replace(/-/g, ' ') || 'Dashboard';
};

/**
 * Find menu item by path
 */
export const findMenuItemByPath = (path, items = MENU_ITEMS) => {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findMenuItemByPath(path, item.children);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get breadcrumbs for a path
 */
export const getBreadcrumbs = (path) => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [];
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: getBreadcrumbLabel(currentPath),
      path: currentPath,
    });
  }

  return breadcrumbs;
};

// ✅ Default export for convenience
export default MENU_ITEMS;