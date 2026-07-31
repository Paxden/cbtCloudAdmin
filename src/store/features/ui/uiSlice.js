/**
 * UI Slice
 * UI state management (sidebar, notifications, etc.)
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  sidebarMini: false,
  notifications: [],
  notificationCount: 0,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarMini: (state) => {
      state.sidebarMini = !state.sidebarMini;
    },
    setSidebarMini: (state, action) => {
      state.sidebarMini = action.payload;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.notificationCount = state.notifications.filter((n) => !n.read).length;
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
        state.notificationCount = state.notifications.filter((n) => !n.read).length;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.notificationCount = 0;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarMini,
  setSidebarMini,
  setNotificationCount,
  addNotification,
  markNotificationRead,
  clearNotifications,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;