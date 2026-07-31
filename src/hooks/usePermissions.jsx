/**
 * usePermissions Hook
 * Permission checking hook
 */

import { useSelector } from 'react-redux';
import {
  selectPermissions,
  selectRoles,
  selectUserRole,
} from '../store/features/auth/authSelectors';
import { ROLES } from '../constants/roles';

export const usePermissions = () => {
  const permissions = useSelector(selectPermissions);
  const roles = useSelector(selectRoles);
  const role = useSelector(selectUserRole);

  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    // SUPER_ADMIN has all permissions
    if (role === ROLES.SUPER_ADMIN) return true;
    return permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   * @param {string[]} permissionList - Permissions to check
   * @returns {boolean}
   */
  const hasAnyPermission = (permissionList) => {
    if (role === ROLES.SUPER_ADMIN) return true;
    return permissionList.some((perm) => permissions.includes(perm));
  };

  /**
   * Check if user has all specified permissions
   * @param {string[]} permissionList - Permissions to check
   * @returns {boolean}
   */
  const hasAllPermissions = (permissionList) => {
    if (role === ROLES.SUPER_ADMIN) return true;
    return permissionList.every((perm) => permissions.includes(perm));
  };

  /**
   * Check if user has specific role
   * @param {string} roleToCheck - Role to check
   * @returns {boolean}
   */
  const hasRole = (roleToCheck) => {
    return roles.includes(roleToCheck);
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roleList - Roles to check
   * @returns {boolean}
   */
  const hasAnyRole = (roleList) => {
    return roleList.some((r) => roles.includes(r));
  };

  /**
   * Check if user can access a resource
   * @param {Object} options - Access options
   * @param {string} options.permission - Required permission
   * @param {string} options.role - Required role
   * @param {string[]} options.roles - Required roles
   * @returns {boolean}
   */
  const canAccess = ({ permission, role: requiredRole, roles: requiredRoles }) => {
    // Check permission
    if (permission && !hasPermission(permission)) {
      return false;
    }

    // Check single role
    if (requiredRole && !hasRole(requiredRole)) {
      return false;
    }

    // Check multiple roles
    if (requiredRoles && requiredRoles.length > 0) {
      return hasAnyRole(requiredRoles);
    }

    // If no checks specified, allow access
    return true;
  };

  return {
    permissions,
    roles,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canAccess,
  };
};

export default usePermissions;