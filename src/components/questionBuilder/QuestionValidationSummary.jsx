/**
 * Question Validation Summary Component
 * Displays validation results with errors and warnings
 */

import { Box, Alert, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Error as ErrorIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const QuestionValidationSummary = ({ validationResult }) => {
  if (!validationResult) {
    return (
      <Alert severity="info">
        Click "Validate" to check your question before submitting.
      </Alert>
    );
  }

  const { isValid, errors = [], warnings = [] } = validationResult;

  if (isValid && warnings.length === 0) {
    return (
      <Alert severity="success" icon={<CheckCircleIcon />}>
        Question is valid and ready for submission!
      </Alert>
    );
  }

  return (
    <Box>
      {!isValid && (
        <Alert severity="error" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {errors.length} error{errors.length > 1 ? 's' : ''} found
          </Typography>
          <List dense disablePadding>
            {errors.map((error, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ErrorIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={error} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {warnings.length > 0 && (
        <Alert severity="warning">
          <Typography variant="subtitle2" fontWeight={600}>
            {warnings.length} warning{warnings.length > 1 ? 's' : ''}
          </Typography>
          <List dense disablePadding>
            {warnings.map((warning, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <WarningIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={warning} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Box>
  );
};

export default QuestionValidationSummary;