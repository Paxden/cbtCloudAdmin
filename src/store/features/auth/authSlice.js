/* eslint-disable no-unused-vars */
/**
 * Auth Slice
 * Redux state management for authentication
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../../services/auth/authService";
import { tokenHelper, storage } from "../../../utils";
import { env } from "../../../config/env";

// Initial state
const initialState = {
  user: null,
  accessToken: tokenHelper.getAccessToken() || null,
  refreshToken: tokenHelper.getRefreshToken() || null,
  isAuthenticated: !!tokenHelper.getAccessToken(),
  isLoading: false,
  isInitialized: false,
  error: null,
  permissions: [],
  roles: [],
};

// ============================================================
// ASYNC THUNKS
// ============================================================

/**
 * Login user
 */
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (!response.success) {
        return rejectWithValue(response.message || "Login failed");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

/**
 * Logout user
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = tokenHelper.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      return { success: true };
    } catch (error) {
      // Even if logout fails, clear local state
      return { success: true };
    }
  },
);

/**
 * Forgot password
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      if (!response.success) {
        return rejectWithValue(
          response.message || "Failed to send reset email",
        );
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send reset email");
    }
  },
);

/**
 * Reset password
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to reset password");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to reset password");
    }
  },
);

/**
 * Change password
 */
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(
        oldPassword,
        newPassword,
      );
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to change password");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to change password");
    }
  },
);

/**
 * Get current user
 */
// At the top of the file, ensure the thunk is defined
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to get user");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to get user");
    }
  },
);

/**
 * Refresh token
 */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = tokenHelper.getRefreshToken();
      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }
      const response = await authService.refreshToken(refreshToken);
      if (!response.success) {
        return rejectWithValue(response.message || "Failed to refresh token");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to refresh token");
    }
  },
);

// ============================================================
// SLICE
// ============================================================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set authenticated
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },

    // Initialize from storage
    initializeAuth: (state) => {
      const token = tokenHelper.getAccessToken();
      const user = tokenHelper.getUser();
      if (token && user) {
        state.accessToken = token;
        state.user = user;
        state.isAuthenticated = true;
        state.permissions = user.permissions || [];
        state.roles = [user.role];
      }
      state.isInitialized = true;
    },

    // Clear all auth state
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.permissions = [];
      state.roles = [];
      state.error = null;
      tokenHelper.clearTokens();
      storage.remove(env.userKey);
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================================
      // LOGIN
      // ============================================================
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const {
          user,
          accessToken,
          refreshToken: newRefreshToken,
        } = action.payload;
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = newRefreshToken || null;
        state.permissions = user.permissions || [];
        state.roles = [user.role];
        state.error = null;

        // Store tokens
        tokenHelper.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenHelper.setRefreshToken(newRefreshToken);
        }
        tokenHelper.setUser(user);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload || "Login failed";
      })

      // ============================================================
      // LOGOUT
      // ============================================================
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roles = [];
        state.error = null;
        tokenHelper.clearTokens();
        storage.remove(env.userKey);
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.permissions = [];
        state.roles = [];
        state.error = null;
        tokenHelper.clearTokens();
        storage.remove(env.userKey);
      })

      // ============================================================
      // FORGOT PASSWORD
      // ============================================================
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send reset email";
      })

      // ============================================================
      // RESET PASSWORD
      // ============================================================
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to reset password";
      })

      // ============================================================
      // CHANGE PASSWORD
      // ============================================================
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to change password";
      })

      // ============================================================
      // GET CURRENT USER
      // ============================================================
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.permissions = action.payload.permissions || [];
        state.roles = [action.payload.role];
        state.isAuthenticated = true;
        state.error = null;
        tokenHelper.setUser(action.payload);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get user";
        // If we can't get the user, logout
        state.isAuthenticated = false;
        state.user = null;
        tokenHelper.clearTokens();
      })

      // ============================================================
      // REFRESH TOKEN
      // ============================================================
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
          tokenHelper.setRefreshToken(action.payload.refreshToken);
        }
        tokenHelper.setAccessToken(action.payload.accessToken);
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload || "Failed to refresh token";
        tokenHelper.clearTokens();
      });
  },
});

// ============================================================
// EXPORT
// ============================================================

export const { clearError, setAuthenticated, initializeAuth, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
