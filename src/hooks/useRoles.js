/**
 * useRoles Hook
 * Role checking hook
 */

import { useSelector } from 'react-redux';
import { selectRoles, selectUserRole } from '../store/features/auth/authSelectors';
import { ROLES, ROLE_HIERARCHY } from '../constants/roles';

export const useRoles = () => {
  const roles = useSelector(selectRoles);
  const role = useSelector(selectUserRole);

  /**
   * Check if user is SUPER_ADMIN
   * @returns {boolean}
   */
  const isSuperAdmin = () => role === ROLES.SUPER_ADMIN;

  /**
   * Check if user is TECH_ADMIN
   * @returns {boolean}
   */
  const isTechAdmin = () => role === ROLES.TECH_ADMIN;

  /**
   * Check if user is EXAM_MANAGER
   * @returns {boolean}
   */
  const isExamManager = () => role === ROLES.EXAM_MANAGER;

  /**
   * Check if user has admin level access (SUPER_ADMIN or TECH_ADMIN)
   * @returns {boolean}
   */
  const isAdmin = () => {
    return role === ROLES.SUPER_ADMIN || role === ROLES.TECH_ADMIN;
  };

  /**
   * Check if user has at least the specified role level
   * @param {string} requiredRole - Required role
   * @returns {boolean}
   */
  const hasMinimumRole = (requiredRole) => {
    const userLevel = ROLE_HIERARCHY[role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
  };

  /**
   * Get user role label
   * @returns {string}
   */
  const getRoleLabel = () => {
    const labels = {
      [ROLES.SUPER_ADMIN]: 'Super Administrator',
      [ROLES.TECH_ADMIN]: 'Technical Administrator',
      [ROLES.EXAM_MANAGER]: 'Exam Manager',
      [ROLES.CANDIDATE]: 'Candidate',
    };
    return labels[role] || role;
  };

  return {
    roles,
    role,
    isSuperAdmin,
    isTechAdmin,
    isExamManager,
    isAdmin,
    hasMinimumRole,
    getRoleLabel,
  };
};

export default useRoles;