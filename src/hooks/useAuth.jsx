/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * Authentication Hook - Cloud Admin
 * Provides auth state and functions
 */

import { useState, useEffect, useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as authService from "../services/auth/authService";
import { tokenHelper } from "../utils";
import {
  login as loginThunk,
  logout as logoutThunk,
  getCurrentUser as getCurrentUserThunk,
  clearError as clearErrorAction,
  initializeAuth,
} from "../store/features/auth/authSlice";
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
  selectPermissions,
  selectRoles,
  selectUserRole,
  selectUserName,
  selectUserEmail,
} from "../store/features/auth/authSelectors";

// Create context
const AuthContext = createContext(null);

// Hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const permissions = useSelector(selectPermissions);
  const roles = useSelector(selectRoles);
  const role = useSelector(selectUserRole);
  const name = useSelector(selectUserName);
  const email = useSelector(selectUserEmail);

  // Local state for initialization
  const [initialized, setInitialized] = useState(false);

  // Initialize auth from storage
  useEffect(() => {
    dispatch(initializeAuth());
    setInitialized(true);
  }, [dispatch]);

  // Login
  const login = async (credentials) => {
    try {
      const result = await dispatch(loginThunk(credentials)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error || "Login failed" };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, message: error || "Logout failed" };
    }
  };

  // Get current user
  const getCurrentUser = async () => {
    try {
      const result = await dispatch(getCurrentUserThunk()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error || "Failed to get user" };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch(clearErrorAction());
  };

  // Has role
  const hasRole = (roleToCheck) => {
    if (Array.isArray(roleToCheck)) {
      return roleToCheck.some((r) => roles.includes(r));
    }
    return roles.includes(roleToCheck);
  };

  // Has permission
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    permissions,
    roles,
    role,
    name,
    email,
    initialized,
    login,
    logout,
    getCurrentUser,
    clearError,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
