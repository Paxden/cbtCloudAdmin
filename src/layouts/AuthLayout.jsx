/**
 * Auth Layout
 * Centered layout for authentication pages with enhanced UX
 * 
 * Key Improvements:
 * - Gradient background
 * - Glassmorphism effect
 * - Better responsiveness
 * - Animated background elements
 * - Professional branding
 */

import { Outlet } from 'react-router-dom';
import { Box, Container, Paper,  alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        // backgroundColor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%),
                          radial-gradient(circle at 90% 80%, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 50%)`,
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          rotate: [0, -5, 0],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              // bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                // background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Outlet />
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthLayout;