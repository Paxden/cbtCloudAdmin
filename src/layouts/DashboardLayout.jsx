/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * Dashboard Layout Component
 * Main application layout with sidebar and top bar
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';

// Components
import TopNavbar from '../components/navigation/TopNavbar';
import Sidebar from '../components/navigation/Sidebar';
import Footer from '../components/navigation/Footer';
import PageContainer from '../components/navigation/PageContainer';

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarPermanent, setSidebarPermanent] = useState(!isMobile);

  // Handle responsive sidebar
  useEffect(() => {
    const isMobileView = window.innerWidth < 600;
    setSidebarOpen(!isMobileView);
    setSidebarPermanent(!isMobileView);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 600;
      setSidebarOpen(!isMobileView);
      setSidebarPermanent(!isMobileView);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const drawerWidth = sidebarOpen ? DRAWER_WIDTH : (isTablet ? 0 : MINI_DRAWER_WIDTH);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <TopNavbar
        drawerWidth={DRAWER_WIDTH}
        open={sidebarOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          transition: 'width 0.2s ease',
        }}
      >
        {/* Mobile Drawer */}
        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </Box>

        {/* Desktop Sidebar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'block' },
            width: drawerWidth,
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: theme.zIndex.appBar - 1,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'width 0.2s ease',
            overflow: 'hidden',
          }}
        >
          <Sidebar open={sidebarOpen} />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        //   width: { sm: `calc(100% - ${drawerWidth}px)` },
        //   ml: { sm: `${drawerWidth}px` },
          transition: 'margin 0.2s ease, width 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {/* Toolbar spacer */}
        <Box sx={{ height: 64 }} />

        {/* Page Content */}
        <PageContainer>
          <Outlet />
        </PageContainer>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;