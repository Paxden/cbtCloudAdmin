/**
 * Blueprint Validation Card Component
 * Displays validation results for a blueprint
 */

import { Paper, Typography, Stack, Chip, Box, Divider, Alert } from '@mui/material';
import {
  CheckCircle as ValidIcon,
  Cancel as InvalidIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const ValidationItem = ({ label, status, message }) => {
  const getColor = () => {
    if (status === 'valid') return 'success';
    if (status === 'warning') return 'warning';
    return 'error';
  };

  const getIcon = () => {
    if (status === 'valid') return <ValidIcon fontSize="small" color="success" />;
    if (status === 'warning') return <WarningIcon fontSize="small" color="warning" />;
    return <InvalidIcon fontSize="small" color="error" />;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
      {getIcon()}
      <Typography variant="body2" sx={{ flex: 1 }}>
        {label}
      </Typography>
      <Chip
        label={status.toUpperCase()}
        size="small"
        color={getColor()}
        variant="outlined"
      />
      {message && (
        <Typography variant="caption" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

const BlueprintValidationCard = ({ validation, loading }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="textSecondary">Validating blueprint...</Typography>
      </Paper>
    );
  }

  if (!validation) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Run validation to check blueprint completeness
        </Typography>
      </Paper>
    );
  }

  const { isValid, errors = [], warnings = [] } = validation;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Validation Results
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip
          label={isValid ? 'Valid' : 'Invalid'}
          color={isValid ? 'success' : 'error'}
          size="medium"
        />
        <Chip
          label={`${errors.length} errors`}
          color="error"
          size="medium"
          variant="outlined"
        />
        <Chip
          label={`${warnings.length} warnings`}
          color="warning"
          size="medium"
          variant="outlined"
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Errors */}
      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="error" gutterBottom>
            Errors
          </Typography>
          <Stack spacing={0.5}>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" icon={false} sx={{ py: 0.5 }}>
                {error.message || error}
              </Alert>
            ))}
          </Stack>
        </Box>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="warning" gutterBottom>
            Warnings
          </Typography>
          <Stack spacing={0.5}>
            {warnings.map((warning, index) => (
              <Alert key={index} severity="warning" icon={false} sx={{ py: 0.5 }}>
                {warning.message || warning}
              </Alert>
            ))}
          </Stack>
        </Box>
      )}

      {/* Validation Items */}
      {validation.items && validation.items.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={0.5}>
            {validation.items.map((item, index) => (
              <ValidationItem
                key={index}
                label={item.label}
                status={item.status}
                message={item.message}
              />
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default BlueprintValidationCard;