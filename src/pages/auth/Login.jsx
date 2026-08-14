/* eslint-disable react-hooks/set-state-in-effect */

/**
 * Login Page
 * Authentication page with enhanced UX
 * 
 * Key Improvements:
 * - Smooth page transitions
 * - Better error handling
 * - Loading states
 * - Redirect logic with animation
 * - Professional layout
 * - Accessibility improvements
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Fade, Slide, Alert, Snackbar,Typography } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';
import AuthCard from '../../components/auth/AuthCard';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check for redirect message
  const from = location.state?.from?.pathname || '/dashboard';
  const message = location.state?.message || null;

  useEffect(() => {
    if (isAuthenticated && !redirecting) {
      setRedirecting(true);
      setShowWelcome(true);
      
      // Show welcome message briefly then redirect
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1200);
    }
  }, [isAuthenticated, navigate, from, redirecting]);

  // Page animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '3px solid',
              borderColor: 'primary.main',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Box
            sx={{
              width: 200,
              height: 4,
              borderRadius: 2,
              bgcolor: 'grey.200',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '30%',
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 2,
                animation: 'loading 1.5s ease-in-out infinite',
                '@keyframes loading': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(400%)' },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'background.default',
      }}
    >
      {/* Welcome overlay when redirecting */}
      <Slide direction="up" in={showWelcome} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.paper',
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                p: 4,
                borderRadius: '50%',
                bgcolor: 'success.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: 64,
                }}
              >
                ✅
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={600} align="center">
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="textSecondary" align="center">
              Redirecting to dashboard...
            </Typography>
          </motion.div>
        </Box>
      </Slide>

      {/* Message Alert */}
      {message && (
        <Fade in>
          <Snackbar
            open={true}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              {message}
            </Alert>
          </Snackbar>
        </Fade>
      )}

      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to access your account and continue learning"
        showLogo={true}
        variant="default"
        animationDelay={0.1}
      >
        <LoginForm />
      </AuthCard>
    </motion.div>
  );
};

export default Login;