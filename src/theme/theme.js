/**
 * Theme Configuration - CBT Platform
 * Enterprise-grade Material UI theme with enhanced UX principles
 * 
 * Design Philosophy:
 * - Clean, minimal, and professional
 * - High contrast for accessibility
 * - Consistent spacing and hierarchy
 * - Smooth micro-interactions
 * - Color psychology for educational platforms
 */

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    
    // Primary: Trustworthy blue - perfect for educational platforms
    primary: {
      main: '#2563eb', // Modern vibrant blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // Secondary: Teal for success/achievement indicators
    secondary: {
      main: '#0d9488',
      light: '#14b8a6',
      dark: '#0f766e',
      contrastText: '#ffffff',
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    
    // Semantic colors with better contrast ratios
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0284c7',
      light: '#0ea5e9',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    
    // Enhanced gray scale for better hierarchy
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Background colors with subtle gradients
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
      subtle: '#f8fafc',
    },
    
    // Text colors optimized for readability
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
      hint: '#94a3b8',
    },
    
    // Action states for better interactivity feedback
    action: {
      active: '#2563eb',
      hover: 'rgba(37, 99, 235, 0.04)',
      hoverOpacity: 0.04,
      selected: 'rgba(37, 99, 235, 0.08)',
      selectedOpacity: 0.08,
      disabled: 'rgba(15, 23, 42, 0.26)',
      disabledBackground: 'rgba(15, 23, 42, 0.04)',
      focus: 'rgba(37, 99, 235, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },
  
  // Typography with better readability and hierarchy
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Display styles for landing pages and dashboards
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#0f172a',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      color: '#0f172a',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#0f172a',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      color: '#0f172a',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#0f172a',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#0f172a',
    },
    
    // Body text optimized for long-form reading
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#334155',
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
      color: '#475569',
      letterSpacing: '0.01em',
    },
    
    // Button text with better readability
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
    },
    
    // Supporting text styles
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#64748b',
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#64748b',
    },
    subtitle1: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#334155',
    },
    subtitle2: {
      fontSize: '0.8125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#475569',
    },
  },
  
  // Consistent spacing for better rhythm
  spacing: 8,
  
  // Rounded corners with consistency
  shape: {
    borderRadius: 8,
    borderRadiusSmall: 6,
    borderRadiusLarge: 12,
  },
  
  // Enhanced shadows for better depth perception
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 30px 60px -15px rgba(0, 0, 0, 0.3)',
    '0 35px 70px -20px rgba(0, 0, 0, 0.35)',
    '0 40px 80px -25px rgba(0, 0, 0, 0.4)',
    '0 45px 90px -30px rgba(0, 0, 0, 0.45)',
    '0 50px 100px -35px rgba(0, 0, 0, 0.5)',
    '0 55px 110px -40px rgba(0, 0, 0, 0.55)',
    '0 60px 120px -45px rgba(0, 0, 0, 0.6)',
    '0 65px 130px -50px rgba(0, 0, 0, 0.65)',
    '0 70px 140px -55px rgba(0, 0, 0, 0.7)',
    '0 75px 150px -60px rgba(0, 0, 0, 0.75)',
    '0 80px 160px -65px rgba(0, 0, 0, 0.8)',
    '0 85px 170px -70px rgba(0, 0, 0, 0.85)',
    '0 90px 180px -75px rgba(0, 0, 0, 0.9)',
    '0 95px 190px -80px rgba(0, 0, 0, 0.95)',
    '0 100px 200px -85px rgba(0, 0, 0, 1)',
    '0 105px 210px -90px rgba(0, 0, 0, 1)',
    '0 110px 220px -95px rgba(0, 0, 0, 1)',
    '0 115px 230px -100px rgba(0, 0, 0, 1)',
  ],
  
  // Component-specific overrides for consistent UX
  components: {
    // ===== BUTTONS =====
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '10px 28px',
          fontSize: '1rem',
        },
        startIcon: {
          marginRight: 8,
        },
        endIcon: {
          marginLeft: 8,
        },
      },
    },
    
    // ===== ICON BUTTONS =====
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
        sizeSmall: {
          padding: 6,
        },
      },
    },
    
    // ===== PAPERS & CARDS =====
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(226, 232, 240, 0.6)',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s ease-in-out',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(226, 232, 240, 0.6)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '20px 24px 12px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#0f172a',
        },
        subheader: {
          fontSize: '0.8125rem',
          color: '#64748b',
        },
      },
    },
    
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
    
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px 24px 20px',
        },
      },
    },
    
    // ===== TABLES =====
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(226, 232, 240, 0.6)',
          overflow: 'auto',
        },
      },
    },
    
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          fontSize: '0.8125rem',
          borderBottom: '1px solid #e2e8f0',
          color: '#334155',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          color: '#0f172a',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          borderBottom: '2px solid #e2e8f0',
        },
        body: {
          '&:last-child': {
            borderBottom: 'none',
          },
        },
      },
    },
    
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
          },
          '&:last-child': {
            '& .MuiTableCell-root': {
              borderBottom: 'none',
            },
          },
        },
      },
    },
    
    // ===== CHIPS =====
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        sizeSmall: {
          fontSize: '0.6875rem',
          padding: '0 8px',
          height: 24,
        },
        sizeMedium: {
          height: 32,
        },
        label: {
          padding: '0 12px',
        },
        colorPrimary: {
          backgroundColor: '#eff6ff',
          color: '#2563eb',
        },
        colorSecondary: {
          backgroundColor: '#f0fdfa',
          color: '#0d9488',
        },
        colorSuccess: {
          backgroundColor: '#ecfdf5',
          color: '#059669',
        },
        colorError: {
          backgroundColor: '#fef2f2',
          color: '#dc2626',
        },
        colorWarning: {
          backgroundColor: '#fffbeb',
          color: '#d97706',
        },
        colorInfo: {
          backgroundColor: '#eff6ff',
          color: '#0284c7',
        },
      },
    },
    
    // ===== DIALOGS =====
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          padding: 0,
        },
        paperFullScreen: {
          borderRadius: 0,
        },
        paperWidthSm: {
          maxWidth: 448,
        },
        paperWidthMd: {
          maxWidth: 640,
        },
        paperWidthLg: {
          maxWidth: 1024,
        },
      },
    },
    
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#0f172a',
        },
      },
    },
    
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 20px',
          color: '#475569',
          '&:first-of-type': {
            paddingTop: 0,
          },
        },
      },
    },
    
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          borderTop: '1px solid #e2e8f0',
        },
      },
    },
    
    // ===== FORM ELEMENTS =====
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: '#e2e8f0',
              borderWidth: 1.5,
            },
            '&:hover fieldset': {
              borderColor: '#94a3b8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748b',
            '&.Mui-focused': {
              color: '#2563eb',
            },
          },
        },
      },
    },
    
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        select: {
          padding: '11px 14px',
        },
      },
    },
    
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
          fontSize: '0.8125rem',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          '&.Mui-selected': {
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            '&:hover': {
              backgroundColor: '#dbeafe',
            },
          },
        },
      },
    },
    
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    
    MuiRadio: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 26,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(18px)',
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: '#2563eb',
            },
          },
        },
        thumb: {
          width: 22,
          height: 22,
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        },
        track: {
          borderRadius: 13,
          backgroundColor: '#e2e8f0',
          opacity: 1,
        },
      },
    },
    
    // ===== APP BAR & DRAWER =====
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(226, 232, 240, 0.6)',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    
    // ===== NOTIFICATIONS =====
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
          },
        },
      },
    },
    
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 16px',
        },
        standardSuccess: {
          backgroundColor: '#ecfdf5',
          color: '#065f46',
        },
        standardError: {
          backgroundColor: '#fef2f2',
          color: '#991b1b',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          color: '#92400e',
        },
        standardInfo: {
          backgroundColor: '#eff6ff',
          color: '#1e40af',
        },
      },
    },
    
    // ===== TOOLTIPS =====
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          padding: '4px 12px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        },
        arrow: {
          color: '#0f172a',
        },
      },
    },
    
    // ===== BADGES =====
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.6875rem',
          height: 20,
          minWidth: 20,
          padding: '0 6px',
        },
        colorPrimary: {
          backgroundColor: '#2563eb',
        },
        colorSecondary: {
          backgroundColor: '#0d9488',
        },
        dot: {
          height: 8,
          minWidth: 8,
          borderRadius: '50%',
        },
      },
    },
    
    // ===== TABS =====
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e2e8f0',
          minHeight: 48,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: '#2563eb',
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          color: '#64748b',
          minHeight: 48,
          padding: '0 16px',
          '&.Mui-selected': {
            color: '#0f172a',
            fontWeight: 600,
          },
          '&:hover': {
            color: '#0f172a',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    
    // ===== MENU =====
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.6)',
          marginTop: 4,
        },
      },
    },
    
    // ===== LIST =====
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    
    // ===== AVATARS =====
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#e2e8f0',
          color: '#475569',
          fontWeight: 500,
        },
      },
    },
    
    // ===== SKELETON =====
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    
    // ===== BREADCRUMBS =====
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          color: '#94a3b8',
          marginLeft: 8,
          marginRight: 8,
        },
        li: {
          fontSize: '0.8125rem',
        },
      },
    },
    
    // ===== PAGINATION =====
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8,
            '&:hover': {
              backgroundColor: '#f8fafc',
            },
            '&.Mui-selected': {
              backgroundColor: '#2563eb',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            },
          },
        },
      },
    },
    
    // ===== PROGRESS =====
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
          height: 6,
        },
        bar: {
          borderRadius: 4,
          backgroundColor: '#2563eb',
        },
        colorPrimary: {
          backgroundColor: '#e2e8f0',
        },
      },
    },
    
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#2563eb',
        },
      },
    },
    
    // ===== TYPOGRAPHY =====
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: '0.5em',
        },
        paragraph: {
          marginBottom: '1em',
        },
      },
    },
  },
});

export default theme;