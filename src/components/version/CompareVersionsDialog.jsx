/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * CompareVersionsDialog
 * Dialog for comparing two package versions
 * 
 * Location: src/components/version/CompareVersionsDialog.jsx
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
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  CompareArrows as CompareIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import VersionStatusChip from './VersionStatusChip';
import VersionChangeSeverity from './VersionChangeSeverity';
import { ChangeTypeLabels } from '../../types/version.types';

const CompareVersionsDialog = ({
  open,
  onClose,
  versions = [],
  onCompare,
  loading = false,
  error = null,
  result = null,
}) => {
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');

  useEffect(() => {
    if (open) {
      setVersionA('');
      setVersionB('');
    }
  }, [open]);

  const handleCompare = () => {
    if (versionA && versionB && versionA !== versionB) {
      onCompare(versionA, versionB);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    const diff = result.differences || {};

    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          Comparing {result.version1?.versionLabel} vs {result.version2?.versionLabel}
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {result.version1?.versionLabel}
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <VersionStatusChip status={result.version1?.status} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Severity</Typography>
                  <VersionChangeSeverity severity={result.version1?.severity} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Candidates</Typography>
                  <Typography variant="body2">{result.version1?.candidateCount || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Questions</Typography>
                  <Typography variant="body2">{result.version1?.questionCount || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Changes</Typography>
                  <Typography variant="body2">{result.version1?.changes?.length || 0}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {result.version2?.versionLabel}
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <VersionStatusChip status={result.version2?.status} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Severity</Typography>
                  <VersionChangeSeverity severity={result.version2?.severity} size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Candidates</Typography>
                  <Typography variant="body2">{result.version2?.candidateCount || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Questions</Typography>
                  <Typography variant="body2">{result.version2?.questionCount || 0}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Changes</Typography>
                  <Typography variant="body2">{result.version2?.changes?.length || 0}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Differences */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Differences
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Candidates</Typography>
                <Typography variant="body2">
                  {diff.candidateCount > 0 ? '+' : ''}{diff.candidateCount || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Questions</Typography>
                <Typography variant="body2">
                  {diff.questionCount > 0 ? '+' : ''}{diff.questionCount || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Package Size</Typography>
                <Typography variant="body2">
                  {diff.packageSize > 0 ? '+' : ''}{diff.packageSize || 0} bytes
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {diff.detectedChanges && diff.detectedChanges.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Detected Changes:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
                {diff.detectedChanges.map((change, idx) => (
                  <Chip
                    key={idx}
                    label={ChangeTypeLabels[change.type] || change.type}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const canCompare = () => {
    return versionA && versionB && versionA !== versionB && !loading && !result;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CompareIcon />
            <Typography variant="h6">Compare Versions</Typography>
          </Box>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || 'Failed to compare versions'}
          </Alert>
        )}

        {!result && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Select two versions to compare their differences.
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Version A</InputLabel>
                  <Select
                    value={versionA}
                    onChange={(e) => setVersionA(e.target.value)}
                    label="Version A"
                    disabled={loading}
                  >
                    {versions.map((v) => (
                      <MenuItem key={v._id} value={v._id}>
                        {v.versionLabel} - {v.versionCode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Version B</InputLabel>
                  <Select
                    value={versionB}
                    onChange={(e) => setVersionB(e.target.value)}
                    label="Version B"
                    disabled={loading}
                  >
                    {versions.map((v) => (
                      <MenuItem key={v._id} value={v._id}>
                        {v.versionLabel} - {v.versionCode}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {loading && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <CircularProgress />
                <Typography sx={{ mt: 1 }}>Comparing versions...</Typography>
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
            startIcon={<CompareIcon />}
            onClick={handleCompare}
            disabled={!canCompare()}
          >
            {loading ? 'Comparing...' : 'Compare'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CompareVersionsDialog;