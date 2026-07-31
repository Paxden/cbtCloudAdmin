/**
 * Theme Configuration
 * Material UI enterprise theme
 */

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00897b',
      light: '#4db6ac',
      dark: '#00695c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.10)',
    '0 6px 18px rgba(0,0,0,0.12)',
    '0 8px 24px rgba(0,0,0,0.14)',
    '0 10px 30px rgba(0,0,0,0.16)',
    '0 12px 36px rgba(0,0,0,0.18)',
    '0 14px 42px rgba(0,0,0,0.20)',
    '0 16px 48px rgba(0,0,0,0.22)',
    '0 18px 54px rgba(0,0,0,0.24)',
    '0 20px 60px rgba(0,0,0,0.26)',
    '0 22px 66px rgba(0,0,0,0.28)',
    '0 24px 72px rgba(0,0,0,0.30)',
    '0 26px 78px rgba(0,0,0,0.32)',
    '0 28px 84px rgba(0,0,0,0.34)',
    '0 30px 90px rgba(0,0,0,0.36)',
    '0 32px 96px rgba(0,0,0,0.38)',
    '0 34px 102px rgba(0,0,0,0.40)',
    '0 36px 108px rgba(0,0,0,0.42)',
    '0 38px 114px rgba(0,0,0,0.44)',
    '0 40px 120px rgba(0,0,0,0.46)',
    '0 42px 126px rgba(0,0,0,0.48)',
    '0 44px 132px rgba(0,0,0,0.50)',
    '0 46px 138px rgba(0,0,0,0.52)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          },
        },
        contained: {
          boxShadow: 'none',
        },
        outlined: {
          borderWidth: 1.5,
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '10px 28px',
          fontSize: '1rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
        elevation2: {
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        },
        elevation3: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '8px 20px 16px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          fontSize: '0.8125rem',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f8fafc',
          color: '#1a1a2e',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
        },
        sizeSmall: {
          fontSize: '0.6875rem',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px 16px',
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 24px 20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1a2e',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontSize: '0.75rem',
          padding: '4px 12px',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;