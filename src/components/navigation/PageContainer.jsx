/**
 * Page Container Component
 * Wrapper for page content with consistent padding
 */

import { Box } from '@mui/material';

const PageContainer = ({
  children,
  maxWidth = 'xl',
  sx = {},
}) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        maxWidth: maxWidth === 'xl' ? '100%' : maxWidth,
        mx: 'auto',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;