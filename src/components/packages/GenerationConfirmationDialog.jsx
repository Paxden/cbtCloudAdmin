/* eslint-disable no-unused-vars */
/**
 * GenerationConfirmationDialog Component
 * Confirmation dialog before generation
 * 
 * Location: src/components/packages/GenerationConfirmationDialog.jsx
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Alert
} from '@mui/material';
import {
  Warning as WarningIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const GenerationConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  instance,
  centres,
  loading = false
}) => {
  if (!instance) return null;

  const centreCount = centres?.length || 0;
  const candidateCount = instance.candidateCount || 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="warning" />
          <Typography variant="h6">Confirm Package Generation</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action will generate secure CBTX packages for the selected centres.
          This process may take several minutes.
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Instance
          </Typography>
          <Typography variant="body2">
            {instance.instanceCode} - {instance.examName}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Centres Selected
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {centres?.map(centre => (
              <Chip
                key={centre._id}
                label={centre.name || centre.centreName}
                size="small"
                icon={<LocationIcon />}
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {centreCount} centres selected
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Candidates
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {candidateCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Packages to Generate
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {centreCount}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Encryption
            </Typography>
            <Chip label="AES-256-GCM" size="small" color="primary" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Signature
            </Typography>
            <Chip label="Ed25519" size="small" color="secondary" />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<SecurityIcon />}
        >
          {loading ? 'Generating...' : 'Generate Packages'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenerationConfirmationDialog;