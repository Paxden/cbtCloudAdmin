/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * DistributionDialog
 * Dialog for creating package distributions
 * 
 * Location: src/components/distribution/DistributionDialog.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { DistributionStatusLabels } from '../../types/distribution.types';

const DistributionDialog = ({
  open,
  onClose,
  packages = [],
  centres = [],
  onCreate,
  loading = false,
  error = null,
  result = null,
}) => {
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);

  useEffect(() => {
    if (open) {
      setSelectedPackage('');
      setSelectedCentre('');
      setExpiryDays(30);
    }
  }, [open]);

  const handleSubmit = () => {
    onCreate({
      packageId: selectedPackage,
      centreId: selectedCentre,
      expiryDays,
    });
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Distribution Created
        </Typography>
        
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={DistributionStatusLabels[result.status] || result.status}
              size="small"
              color={result.status === 'AVAILABLE' ? 'success' : 'default'}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Centre
            </Typography>
            <Typography variant="body2">{result.centreCode}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              File
            </Typography>
            <Typography variant="body2">{result.fileName}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Expires At
            </Typography>
            <Typography variant="body2">
              {new Date(result.expiresAt).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Download Token
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
              }}
            >
              {result.downloadToken?.substring(0, 16)}...
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  };

  const canSubmit = () => {
    return selectedPackage && selectedCentre && !loading && !result;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon />
            <Typography variant="h6">Create Distribution</Typography>
          </Box>
          <Button onClick={onClose} disabled={loading}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || 'Failed to create distribution'}
          </Alert>
        )}

        {!result && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              This will assign the selected package to a centre, making it available for download.
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Package</InputLabel>
              <Select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                label="Select Package"
                disabled={loading}
              >
                {packages.length === 0 ? (
                  <MenuItem value="" disabled>
                    No packages available
                  </MenuItem>
                ) : (
                  packages.map((pkg) => (
                    <MenuItem key={pkg._id} value={pkg._id}>
                      {pkg.packageCode} - {pkg.centreCode}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Centre</InputLabel>
              <Select
                value={selectedCentre}
                onChange={(e) => setSelectedCentre(e.target.value)}
                label="Select Centre"
                disabled={loading}
              >
                {centres.length === 0 ? (
                  <MenuItem value="" disabled>
                    No centres available
                  </MenuItem>
                ) : (
                  centres.map((centre) => (
                    <MenuItem key={centre._id} value={centre._id}>
                      {centre.code} - {centre.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Expiry Days"
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
              helperText="Number of days the distribution will be available"
              disabled={loading}
              InputProps={{
                inputProps: { min: 1, max: 365 },
              }}
            />

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Creating distribution...
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {result && renderResult()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {result ? 'Close' : 'Cancel'}
        </Button>
        {!result && (
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={!canSubmit()}
          >
            {loading ? 'Creating...' : 'Create Distribution'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DistributionDialog;