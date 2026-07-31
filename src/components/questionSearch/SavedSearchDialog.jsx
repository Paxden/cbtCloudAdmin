/**
 * Saved Search Dialog Component
 * Save current search for later use
 */

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Chip,
  Stack,
} from '@mui/material';

const SavedSearchDialog = ({
  open,
  onClose,
  onSave,
  currentFilters,
  loading = false,
  error = null,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleSave = () => {
    if (!name.trim()) {
      setValidationError('Search name is required');
      return;
    }

    const activeFilters = Object.keys(currentFilters).filter(
      (key) => currentFilters[key] && currentFilters[key] !== '' && currentFilters[key] !== false
    );

    if (activeFilters.length === 0) {
      setValidationError('No active filters to save. Please apply some filters first.');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      filters: currentFilters,
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setValidationError(null);
    onClose();
  };

  const activeFilterCount = Object.keys(currentFilters).filter(
    (key) => currentFilters[key] && currentFilters[key] !== '' && currentFilters[key] !== false
  ).length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>Save Search</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {validationError && <Alert severity="warning">{validationError}</Alert>}

          <Typography variant="caption" color="textSecondary">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}
          </Typography>

          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {Object.entries(currentFilters).map(([key, value]) => {
              if (!value || value === '' || value === false) return null;
              if (Array.isArray(value) && value.length === 0) return null;
              return (
                <Chip
                  key={key}
                  label={`${key}: ${Array.isArray(value) ? value.length : value}`}
                  size="small"
                  variant="outlined"
                />
              );
            })}
          </Stack>

          <TextField
            label="Search Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder="e.g., Published Promotion Questions"
            autoFocus
          />

          <TextField
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="Brief description of this search"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || activeFilterCount === 0}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Saving...' : 'Save Search'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedSearchDialog;