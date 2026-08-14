/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
/**
 * CreateVersionDialog
 * Dialog for creating a new package version
 * 
 * Location: src/components/version/CreateVersionDialog.jsx
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
  TextField,
  Chip,
  Stack,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { ChangeTypes, ChangeTypeLabels } from '../../types/version.types';

const CreateVersionDialog = ({
  open,
  onClose,
  packageId,
  packageCode,
  onCreate,
  loading = false,
  error = null,
  result = null,
}) => {
  const [changeReason, setChangeReason] = useState('');
  const [changeDescription, setChangeDescription] = useState('');
  const [changes, setChanges] = useState([]);
  const [newChangeType, setNewChangeType] = useState('');
  const [newChangeDescription, setNewChangeDescription] = useState('');

  useEffect(() => {
    if (open) {
      setChangeReason('');
      setChangeDescription('');
      setChanges([]);
      setNewChangeType('');
      setNewChangeDescription('');
    }
  }, [open]);

  const handleAddChange = () => {
    if (newChangeType && newChangeDescription) {
      setChanges([
        ...changes,
        {
          type: newChangeType,
          description: newChangeDescription,
        },
      ]);
      setNewChangeType('');
      setNewChangeDescription('');
    }
  };

  const handleRemoveChange = (index) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onCreate(packageId, {
      changeReason,
      changeDescription,
      changes,
    });
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <Box>
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
          Version created successfully!
        </Alert>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Version Label
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {result.versionLabel}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Version Code
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {result.versionCode}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Changes
            </Typography>
            <Typography variant="body2">
              {result.changes?.length || 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Severity
            </Typography>
            <Chip
              label={result.severity}
              size="small"
              color={result.severity === 'CRITICAL' ? 'error' : 
                     result.severity === 'MAJOR' ? 'warning' : 
                     result.severity === 'MINOR' ? 'info' : 'default'}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={result.status}
              size="small"
              color={result.status === 'GENERATED' ? 'primary' : 'default'}
            />
          </Box>
        </Stack>
      </Box>
    );
  };

  const canSubmit = () => {
    return changeReason.trim() && !loading && !result;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Create New Version</Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message || 'Failed to create version'}
          </Alert>
        )}

        {!result && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Creating a new version for <strong>{packageCode}</strong>. 
              This will increment the version number and create a snapshot.
            </Alert>

            <TextField
              fullWidth
              label="Change Reason"
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Why is this version being created?"
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Change Description (Optional)"
              multiline
              rows={2}
              value={changeDescription}
              onChange={(e) => setChangeDescription(e.target.value)}
              placeholder="Detailed description of changes..."
              disabled={loading}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Changes
            </Typography>

            {/* Add Change */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Change Type</InputLabel>
                <Select
                  value={newChangeType}
                  onChange={(e) => setNewChangeType(e.target.value)}
                  label="Change Type"
                  disabled={loading}
                  size="small"
                >
                  {Object.entries(ChangeTypes).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {ChangeTypeLabels[value] || value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Description"
                value={newChangeDescription}
                onChange={(e) => setNewChangeDescription(e.target.value)}
                disabled={loading}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddChange}
                disabled={!newChangeType || !newChangeDescription || loading}
              >
                Add
              </Button>
            </Box>

            {/* Changes List */}
            <Box sx={{ maxHeight: 150, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
              {changes.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No changes added yet
                </Typography>
              ) : (
                changes.map((change, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 0.5,
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box>
                      <Chip
                        label={ChangeTypeLabels[change.type] || change.type}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {change.description}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveChange(index)}
                      disabled={loading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Creating version...
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
            onClick={handleSubmit}
            disabled={!canSubmit()}
          >
            {loading ? 'Creating...' : 'Create Version'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateVersionDialog;