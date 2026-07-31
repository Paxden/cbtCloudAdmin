// services/navigationService.js - FIXED
import { getBreadcrumbs, findMenuItemByPath } from '../constants/navigation';

/**
 * Extract role from user object (handles both string and object)
 */
const getUserRole = (user) => {
  if (!user) return null;
  if (typeof user.role === 'string') return user.role;
  if (user.role && typeof user.role === 'object' && user.role.name) {
    return user.role.name;
  }
  return null;
};

/**
 * Extract permissions from user object
 */
const getUserPermissions = (user) => {
  if (!user) return [];
  if (Array.isArray(user.permissions)) return user.permissions;
  if (user.role && Array.isArray(user.role.permissions)) {
    return user.role.permissions;
  }
  return [];
};

/**
 * Filter menu items based on user roles and permissions
 */
export const filterMenuItems = (items, user) => {
  // ✅ If no user or no items, return empty array
  if (!user || !items) return [];

  // ✅ Extract role and permissions safely
  const role = getUserRole(user);
  const permissions = getUserPermissions(user);

  // console.log('🔍 filterMenuItems - role:', role);
  // console.log('🔍 filterMenuItems - permissions:', permissions);
  // console.log('🔍 filterMenuItems - items count:', items.length);

  // ✅ SUPER_ADMIN bypasses all checks
  const isSuperAdmin = role === 'SUPER_ADMIN';

  return items
    .map((item) => {
      // ✅ SUPER_ADMIN bypasses role and permission checks
      if (isSuperAdmin) {
        // Still need to process children
        let children = [];
        if (item.children) {
          children = filterMenuItems(item.children, user);
        }
        return {
          ...item,
          children,
        };
      }

      // ✅ Check if user has required role
      if (item.roles && item.roles.length > 0) {
        if (!item.roles.includes(role)) {
          return null;
        }
      }

      // ✅ Check if user has required permissions
      if (item.permissions && item.permissions.length > 0) {
        const hasPermission = item.permissions.some((perm) =>
          permissions.includes(perm)
        );
        if (!hasPermission) return null;
      }

      // ✅ Filter children
      let children = [];
      if (item.children) {
        children = filterMenuItems(item.children, user);
        // If no children and item is a parent, hide it
        if (children.length === 0 && item.children.length > 0) {
          return null;
        }
      }

      return {
        ...item,
        children,
      };
    })
    .filter(Boolean);
};

/**
 * Check if user can access a specific path
 */
export const canAccessPath = (path, user) => {
  if (!user) return false;

  const menuItem = findMenuItemByPath(path);
  if (!menuItem) return true;

  const role = getUserRole(user);
  const permissions = getUserPermissions(user);

  if (menuItem.roles && menuItem.roles.length > 0 && !menuItem.roles.includes(role)) {
    return false;
  }

  if (menuItem.permissions && menuItem.permissions.length > 0) {
    const hasPermission = menuItem.permissions.some((perm) =>
      permissions.includes(perm)
    );
    if (!hasPermission) return false;
  }

  return true;
};

/**
 * Get breadcrumb for current path
 */
export const getBreadcrumbItems = (path) => {
  return getBreadcrumbs(path);
};

/**
 * Get active menu item for current path
 */
export const getActiveMenuItem = (path) => {
  return findMenuItemByPath(path);
};

export default {
  filterMenuItems,
  canAccessPath,
  getBreadcrumbItems,
  getActiveMenuItem,
};