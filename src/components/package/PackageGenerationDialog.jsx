/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * PackageGenerationDialog
 * Dialog for generating centre packages
 * 
 * Location: src/components/package/PackageGenerationDialog.jsx
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
  Inventory as PackageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const PackageGenerationDialog = ({
  open,
  onClose,
  instances = [],
  centres = [],
  onGenerate,
  onGenerateAll,
  loading = false,
  error = null,
  result = null,
  mode = 'single', // single, all
}) => {
  const [selectedInstance, setSelectedInstance] = useState('');
  const [selectedCentre, setSelectedCentre] = useState('');
  const [selectedCentres, setSelectedCentres] = useState([]);
  const [notes, setNotes] = useState('');
  const [generationType, setGenerationType] = useState('single');

  useEffect(() => {
    if (open) {
      setSelectedInstance('');
      setSelectedCentre('');
      setSelectedCentres([]);
      setNotes('');
      setGenerationType('single');
    }
  }, [open]);

  const handleSubmit = () => {
    if (generationType === 'single') {
      onGenerate({
        instanceId: selectedInstance,
        centreId: selectedCentre,
        notes: notes || undefined,
      });
    } else {
      onGenerateAll({
        instanceId: selectedInstance,
        centreIds: selectedCentres.length > 0 ? selectedCentres : undefined,
        notes: notes || undefined,
      });
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const hasErrors = result.failed > 0;
    const isComplete = result.successful > 0;

    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Generation Results
        </Typography>
        
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {result.total || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="success.main">
              Successful
            </Typography>
            <Typography variant="body2" fontWeight="medium" color="success.main">
              {result.successful || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="error.main">
              Failed
            </Typography>
            <Typography variant="body2" fontWeight="medium" color="error.main">
              {result.failed || 0}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Skipped
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {result.skipped || 0}
            </Typography>
          </Box>
        </Stack>

        {result.packages && result.packages.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generated Packages
            </Typography>
            <Stack spacing={0.5}>
              {result.packages.slice(0, 5).map((pkg) => (
                <Typography key={pkg.id} variant="caption" display="block">
                  {pkg.code} - {pkg.centreCode}
                </Typography>
              ))}
              {result.packages.length > 5 && (
                <Typography variant="caption" color="text.secondary">
                  ... and {result.packages.length - 5} more
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {result.errors && result.errors.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="error" gutterBottom>
              Errors
            </Typography>
            <Stack spacing={0.5}>
              {result.errors.slice(0, 3).map((err, idx) => (
                <Typography key={idx} variant="caption" color="error" display="block">
                  {err.centreCode}: {err.error}
                </Typography>
              ))}
              {result.errors.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  ... and {result.errors.length - 3} more
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Paper>
    );
  };

  const canSubmit = () => {
    if (!selectedInstance) return false;
    if (generationType === 'single' && !selectedCentre) return false;
    if (loading || result) return false;
    return true;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PackageIcon />
            <Typography variant="h6">
              {generationType === 'single' ? 'Generate Centre Package' : 'Generate All Packages'}
            </Typography>
          </Box>
          <Button onClick={onClose} disabled={loading}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || 'Failed to generate package'}
          </Alert>
        )}

        {!result && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              {generationType === 'single'
                ? 'This will generate a package for a specific centre with all candidate papers.'
                : 'This will generate packages for all centres in the selected instance.'}
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Generation Type</InputLabel>
              <Select
                value={generationType}
                onChange={(e) => setGenerationType(e.target.value)}
                label="Generation Type"
                disabled={loading}
              >
                <MenuItem value="single">Single Centre</MenuItem>
                <MenuItem value="all">All Centres</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Instance</InputLabel>
              <Select
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                label="Select Instance"
                disabled={loading}
              >
                {instances.length === 0 ? (
                  <MenuItem value="" disabled>
                    No instances available
                  </MenuItem>
                ) : (
                  instances.map((instance) => (
                    <MenuItem key={instance._id} value={instance._id}>
                      {instance.instanceCode} - {instance.examName}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {generationType === 'single' && (
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
            )}

            {generationType === 'all' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Centres (Optional)</InputLabel>
                <Select
                  multiple
                  value={selectedCentres}
                  onChange={(e) => setSelectedCentres(e.target.value)}
                  label="Select Centres (Optional)"
                  disabled={loading}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={centres.find(c => c._id === value)?.code || value}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {centres.map((centre) => (
                    <MenuItem key={centre._id} value={centre._id}>
                      {centre.code} - {centre.name}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="text.secondary">
                  Leave empty to generate for all centres
                </Typography>
              </FormControl>
            )}

            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this generation..."
              disabled={loading}
            />

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Generating packages...
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
            startIcon={<PackageIcon />}
            onClick={handleSubmit}
            disabled={!canSubmit()}
          >
            {loading ? 'Generating...' : 'Generate Package'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PackageGenerationDialog;