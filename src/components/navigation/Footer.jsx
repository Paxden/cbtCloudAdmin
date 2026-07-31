/**
 * Footer Component
 * Application footer
 */

import { Box, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="body2" color="textSecondary">
          © {currentYear} CBT Platform. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Link
            href="#"
            variant="body2"
            color="textSecondary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            variant="body2"
            color="textSecondary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Terms of Service
          </Link>
          <Typography variant="body2" color="textSecondary">
            v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;