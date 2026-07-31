/**
 * Blank Layout
 * Minimal layout without header/sidebar
 */

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const BlankLayout = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Outlet />
    </Box>
  );
};

export default BlankLayout;