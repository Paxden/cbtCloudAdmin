/**
 * Not Found Page
 * 404 Page
 */

import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

const NotFound = () => {
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
        <SearchOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom>
          404
        </Typography>
        <Typography variant="h6" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          The page you are looking for does not exist or has been moved.
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

export default NotFound;