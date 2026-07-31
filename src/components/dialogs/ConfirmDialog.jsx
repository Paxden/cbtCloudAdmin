/* eslint-disable no-unused-vars */
/**
 * Confirm Dialog Component
 * Confirmation dialog for destructive actions
 */

import { Box, Typography, Button } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import AppDialog from './AppDialog';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  loading = false,
  severity = 'info', // info, warning, error, success
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'error':
      case 'warning':
        return <WarningIcon color={severity} sx={{ fontSize: 48 }} />;
      default:
        return null;
    }
  };

  const actions = (
    <>
      <Button onClick={onClose} disabled={loading}>
        {cancelText}
      </Button>
      <Button
        onClick={onConfirm}
        color={confirmColor}
        variant="contained"
        disabled={loading}
      >
        {loading ? 'Loading...' : confirmText}
      </Button>
    </>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="xs"
      actions={actions}
      loading={loading}
      showCloseButton={false}
      dividers={false}
    >
      <Box sx={{ textAlign: 'center', py: 2 }}>
        {getIcon()}
        <Typography variant="body1" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </AppDialog>
  );
};

export default ConfirmDialog;