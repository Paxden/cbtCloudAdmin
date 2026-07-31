/* eslint-disable no-unused-vars */
/**
 * Delete Dialog Component
 * Specialized dialog for delete confirmation
 */

import { Box, Typography } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from './ConfirmDialog';

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Delete Item',
  itemName = 'item',
  loading = false,
}) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="error"
      severity="error"
      loading={loading}
    />
  );
};

export default DeleteDialog;