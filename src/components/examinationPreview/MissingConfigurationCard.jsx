/* eslint-disable no-unused-vars */
/**
 * Missing Configuration Card Component
 * Highlights missing or incomplete configurations
 */

import React from 'react';
import {
  Paper,
  Typography,
  Stack,
  Chip,
  Box,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CompleteIcon,
  NavigateNext as NavigateIcon,
} from '@mui/icons-material';

const MissingConfigurationCard = ({ missingItems, readiness, onNavigate }) => {
  if (!missingItems || missingItems.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: 'success.lighter' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CompleteIcon color="success" />
          <Typography variant="h6" fontWeight={600} color="success.main">
            All configurations are complete!
          </Typography>
        </Stack>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Your examination is fully configured and ready for validation.
        </Typography>
      </Paper>
    );
  }

  const criticalItems = missingItems.filter(i => i.severity === 'critical');
  const warningItems = missingItems.filter(i => i.severity === 'warning');

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Missing Configurations
      </Typography>
      <Typography variant="caption" color="textSecondary" paragraph>
        Complete these items before proceeding to validation
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Critical Items */}
      {criticalItems.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Critical ({criticalItems.length})
          </Typography>
          {criticalItems.map((item, index) => (
            <Alert
              key={index}
              severity="error"
              sx={{ mb: 1 }}
              action={
                item.path && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => onNavigate?.(item.path)}
                    endIcon={<NavigateIcon />}
                  >
                    Fix
                  </Button>
                )
              }
            >
              <Typography variant="body2">
                <strong>{item.name}:</strong> {item.message}
              </Typography>
            </Alert>
          ))}
        </Box>
      )}

      {/* Warning Items */}
      {warningItems.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="warning" gutterBottom>
            Warnings ({warningItems.length})
          </Typography>
          {warningItems.map((item, index) => (
            <Alert
              key={index}
              severity="warning"
              sx={{ mb: 1 }}
              action={
                item.path && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => onNavigate?.(item.path)}
                    endIcon={<NavigateIcon />}
                  >
                    Review
                  </Button>
                )
              }
            >
              <Typography variant="body2">
                <strong>{item.name}:</strong> {item.message}
              </Typography>
            </Alert>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`${missingItems.length} items need attention`}
            color="error"
          />
          <Chip
            label={`${criticalItems.length} critical`}
            color="error"
            variant="outlined"
          />
          <Chip
            label={`${warningItems.length} warnings`}
            color="warning"
            variant="outlined"
          />
        </Stack>
      </Box>
    </Paper>
  );
};

export default MissingConfigurationCard;