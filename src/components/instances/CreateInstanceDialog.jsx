/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/**
 * CreateInstanceDialog
 * Dialog for creating a new examination instance
 * 
 * Location: src/components/instances/CreateInstanceDialog.jsx
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';

const CreateInstanceDialog = ({
  open,
  onClose,
  onCreate,
  examinations = [],
  loading = false,
  error = null,
}) => {
  const [selectedExam, setSelectedExam] = useState('');
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (open) {
      setSelectedExam('');
      setNotes('');
      setLocalError(null);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!selectedExam) {
      setLocalError('Please select an examination');
      return;
    }

    setLocalError(null);
    onCreate(selectedExam, notes);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Create Examination Instance
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          This will create an immutable snapshot of the examination for package generation.
          The instance will capture the current state of the examination blueprint,
          configuration, and assigned resources.
        </Typography>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError || error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Examination</InputLabel>
          <Select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            label="Select Examination"
            disabled={loading}
          >
            {examinations.length === 0 ? (
              <MenuItem value="" disabled>
                No validated examinations available
              </MenuItem>
            ) : (
              examinations.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.code} - {exam.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Notes (Optional)"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this instance..."
          disabled={loading}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !selectedExam}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Creating...' : 'Create Instance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInstanceDialog;