/**
 * Loading Overlay Component
 * Full content overlay with spinner
 */

import { Box, CircularProgress, Backdrop } from '@mui/material';

const LoadingOverlay = ({ loading, children, transparent = false }) => {
  if (!loading) return children;

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Backdrop
        open={true}
        sx={{
          position: 'absolute',
          zIndex: 1,
          backgroundColor: transparent ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.85)',
          borderRadius: 1,
        }}
      >
        <CircularProgress />
      </Backdrop>
    </Box>
  );
};

export default LoadingOverlay;