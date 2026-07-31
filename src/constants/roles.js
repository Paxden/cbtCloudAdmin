/**
 * Roles Constants
 * System role definitions
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TECH_ADMIN: 'TECH_ADMIN',
  EXAM_MANAGER: 'EXAM_MANAGER',
  CANDIDATE: 'CANDIDATE',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.TECH_ADMIN]: 'Technical Administrator',
  [ROLES.EXAM_MANAGER]: 'Exam Manager',
  [ROLES.CANDIDATE]: 'Candidate',
};

export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.TECH_ADMIN]: 3,
  [ROLES.EXAM_MANAGER]: 2,
  [ROLES.CANDIDATE]: 1,
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: '#d32f2f',
  [ROLES.TECH_ADMIN]: '#1976d2',
  [ROLES.EXAM_MANAGER]: '#2e7d32',
  [ROLES.CANDIDATE]: '#9e9e9e',
};

export default ROLES;