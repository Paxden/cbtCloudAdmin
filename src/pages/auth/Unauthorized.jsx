/**
 * Unauthorized Page
 * 403 Forbidden page
 */

import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          borderRadius: 3,
        }}
      >
        <LockIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          403
        </Typography>
        <Typography variant="h6" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          You don't have permission to access this page. Please contact your administrator.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default Unauthorized;