/**
 * Auth Selectors
 * Redux selectors for auth state
 */

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectPermissions = (state) => state.auth.permissions || [];
export const selectRoles = (state) => state.auth.roles || [];
export const selectUserRole = (state) => {
  const user = state.auth.user;
  // ✅ Return primitive string, not the whole user object
  return typeof user?.role === 'string' ? user.role : 'EXAM_MANAGER';
};
export const selectUserName = (state) => {
  const user = state.auth.user;
  return typeof user?.name === 'string' ? user.name : 'User';
};
export const selectUserEmail = (state) => {
  const user = state.auth.user;
  return typeof user?.email === 'string' ? user.email : '';
};

/**
 * Check if user has specific role
 */
export const selectHasRole = (role) => (state) => {
  const roles = state.auth.roles || [];
  return roles.includes(role);
};

/**
 * Check if user has any of the specified roles
 */
export const selectHasAnyRole = (roles) => (state) => {
  const userRoles = state.auth.roles || [];
  return roles.some((role) => userRoles.includes(role));
};

/**
 * Check if user has specific permission
 */
export const selectHasPermission = (permission) => (state) => {
  const permissions = state.auth.permissions || [];
  return permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const selectHasAnyPermission = (permissions) => (state) => {
  const userPermissions = state.auth.permissions || [];
  return permissions.some((perm) => userPermissions.includes(perm));
};