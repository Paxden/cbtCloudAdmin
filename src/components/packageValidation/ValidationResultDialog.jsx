/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * ValidationResultDialog Component
 * Displays validation result
 * 
 * Location: src/components/packageValidation/ValidationResultDialog.jsx
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Alert,
  Grid,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  Refresh as RetryIcon
} from '@mui/icons-material';

const ValidationResultDialog = ({
  open,
  onClose,
  result,
  onViewPackage,
  onRetry
}) => {
  if (!result) return null;

  const isSuccess = result.status === 'VALID' || result.status === 'READY';
  const isWarning = result.status === 'WARNING';
  const isFailed = result.status === 'FAILED' || result.status === 'REJECTED';

  const getStatusColor = () => {
    if (isSuccess) return 'success';
    if (isWarning) return 'warning';
    return 'error';
  };

  const getStatusIcon = () => {
    if (isSuccess) return <SuccessIcon color="success" sx={{ fontSize: 48 }} />;
    if (isWarning) return <WarningIcon color="warning" sx={{ fontSize: 48 }} />;
    return <ErrorIcon color="error" sx={{ fontSize: 48 }} />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Validation Result
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status Header */}
        <Box sx={{ textAlign: 'center', py: 2 }}>
          {getStatusIcon()}
          <Typography variant="h5" color={`${getStatusColor()}.main`} gutterBottom>
            {isSuccess ? 'Validation Passed' : isWarning ? 'Validation with Warnings' : 'Validation Failed'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Package validation completed with {result.checks?.total || 0} checks
          </Typography>
        </Box>

        {/* Score */}
        {result.score !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">Validation Score</Typography>
              <Typography variant="caption" fontWeight={500}>
                {Math.round(result.score)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={result.score}
              color={result.score >= 90 ? 'success' : result.score >= 70 ? 'warning' : 'error'}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="success.main">
                Passed
              </Typography>
              <Typography variant="h5" color="success.main">
                {result.checks?.passed || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="warning.main">
                Warnings
              </Typography>
              <Typography variant="h5" color="warning.main">
                {result.checks?.warnings || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="error.main">
                Failed
              </Typography>
              <Typography variant="h5" color="error.main">
                {result.checks?.failed || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Warnings */}
        {result.warnings && result.warnings.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Warnings</Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Errors */}
        {result.errors && result.errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Errors</Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Recommendations</Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Summary */}
        {result.summary && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Summary
            </Typography>
            <Typography variant="body2">
              {result.summary}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={onClose}>Close</Button>
        {isSuccess && onViewPackage && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<ViewIcon />}
            onClick={onViewPackage}
          >
            View Package
          </Button>
        )}
        {(isWarning || isFailed) && onRetry && (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RetryIcon />}
            onClick={onRetry}
          >
            Retry Validation
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ValidationResultDialog;