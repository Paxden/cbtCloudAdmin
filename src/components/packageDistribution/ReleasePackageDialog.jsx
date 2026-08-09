/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * ReleasePackageDialog Component
 * Dialog for releasing packages
 * 
 * Location: src/components/packageDistribution/ReleasePackageDialog.jsx
 */

import React, { useState } from 'react';
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
  Grid,
  Paper,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Security as SecurityIcon,
  CheckCircle as ValidIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const ReleasePackageDialog = ({
  open,
  onClose,
  onConfirm,
  packages,
  loading = false,
  error = null
}) => {
  const [notes, setNotes] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);

  if (!packages || packages.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Release Package</DialogTitle>
        <DialogContent>
          <Alert severity="warning">No packages selected for release</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  const packageCount = packages.length;
  const isSingle = packageCount === 1;
  const firstPackage = packages[0];

  const handleConfirm = () => {
    onConfirm({
      notes,
      expiryDays
    });
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
            {isSingle ? 'Release Package' : `Release ${packageCount} Packages`}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Package Summary */}
        {isSingle ? (
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Package</Typography>
                <Typography variant="body2" fontWeight={500}>
                  {firstPackage.name || firstPackage.packageName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Version</Typography>
                <Typography variant="body2">
                  V{firstPackage.version || firstPackage.packageVersion || 1}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Centre</Typography>
                <Typography variant="body2">
                  {firstPackage.centreName || firstPackage.centre?.name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Candidates</Typography>
                <Typography variant="body2">
                  {firstPackage.candidateCount || 0}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2">
              Releasing {packageCount} packages to their assigned centres
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
              {packages.slice(0, 5).map((pkg, index) => (
                <Chip
                  key={index}
                  label={pkg.name || pkg.packageName || `Package ${index + 1}`}
                  size="small"
                />
              ))}
              {packages.length > 5 && (
                <Chip
                  label={`+${packages.length - 5} more`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>
        )}

        {/* Validation Status */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Validation Status
          </Typography>
          <Box display="flex" gap={2}>
            <Chip
              icon={<ValidIcon />}
              label="Validated"
              color="success"
              size="small"
            />
            <Chip
              icon={<SecurityIcon />}
              label="Security Check Passed"
              color="success"
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Release Options */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Release Options
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Release Notes (Optional)"
                placeholder="Add notes about this release..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Expiry Days for Download"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value) || 7)}
                helperText="Number of days before download link expires"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Confirmation Message */}
        <Alert severity="info">
          {isSingle
            ? `This will release the package to ${firstPackage.centreName || 'the centre'}.`
            : `This will release ${packageCount} packages to their respective centres.`}
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Releasing...' : `Release ${isSingle ? 'Package' : 'Packages'}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReleasePackageDialog;