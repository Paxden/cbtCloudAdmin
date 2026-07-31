/* eslint-disable no-unused-vars */
/**
 * Publish Readiness Dialog Component
 * Confirmation dialog for approving examination
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  TextField,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as ReadyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const PublishReadinessDialog = ({
  open,
  onClose,
  onApprove,
  approving,
  readiness,
  comments,
  onCommentsChange,
}) => {
  const isReady = readiness?.isReady || false;
  const score = readiness?.percentage || 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          {isReady ? (
            <ReadyIcon color="success" />
          ) : (
            <WarningIcon color="warning" />
          )}
          <Typography variant="h6">
            {isReady ? 'Approve for Validation' : 'Review Required'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {!isReady ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This examination is not fully ready for validation.
            Please review the missing items before proceeding.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            This examination is ready for validation.
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Readiness Summary
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${score}% Ready`}
              color={score >= 90 ? 'success' : score >= 70 ? 'warning' : 'error'}
            />
            <Chip
              label={`${readiness?.completed || 0}/${readiness?.total || 0} items complete`}
              variant="outlined"
            />
          </Stack>
        </Box>

        {readiness?.missing && readiness.missing.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="error" gutterBottom>
              Missing Items ({readiness.missing.length})
            </Typography>
            <Stack spacing={0.5}>
              {readiness.missing.map((item, index) => (
                <Chip
                  key={index}
                  label={item}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <TextField
          label="Approval Comments"
          multiline
          rows={3}
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          fullWidth
          placeholder="Add any comments about this approval..."
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={approving}>
          Cancel
        </Button>
        <Button
          onClick={onApprove}
          variant="contained"
          color="success"
          disabled={!isReady || approving}
          startIcon={approving ? <CircularProgress size={20} /> : <ReadyIcon />}
        >
          {approving ? 'Approving...' : 'Approve'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublishReadinessDialog;