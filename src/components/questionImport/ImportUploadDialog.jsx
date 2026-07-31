/**
 * Import Upload Dialog Component
 * Upload questions via file
 */

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Paper,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const STEPS = ['Upload File', 'Processing', 'Complete'];

const ImportUploadDialog = ({
  open,
  onClose,
  onUpload,
  loading = false,
  error = null,
}) => {
  const [file, setFile] = useState(null);
  const [autoImport, setAutoImport] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setUploadError(null);
      setActiveStep(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file');
      return;
    }

    setActiveStep(1);
    setUploadProgress(30);

    try {
      await onUpload(file, { autoImport });
      setActiveStep(2);
      setUploadProgress(100);
      // Close after a delay to show completion
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
      setActiveStep(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadError(null);
    setUploadProgress(0);
    setActiveStep(0);
    onClose();
  };

  const isProcessing = activeStep === 1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>Import Questions</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {uploadError && <Alert severity="error">{uploadError}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Dropzone */}
          <Paper
            {...getRootProps()}
            sx={{
              p: 3,
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'transparent',
              transition: 'all 0.2s ease',
              opacity: isProcessing ? 0.6 : 1,
              pointerEvents: isProcessing ? 'none' : 'auto',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {(file.size / 1024).toFixed(1)} KB • {file.type || 'Unknown type'}
                </Typography>
                <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 1 }}>
                  Click to change file
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Supported: Excel (.xlsx), CSV, JSON (max 10MB)
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Progress */}
          {isProcessing && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Processing your file...
              </Typography>
            </Box>
          )}

          {/* Auto Import Switch */}
          <FormControlLabel
            control={
              <Switch
                checked={autoImport}
                onChange={(e) => setAutoImport(e.target.checked)}
                disabled={isProcessing}
              />
            }
            label="Auto-import valid questions"
          />

          <Typography variant="caption" color="textSecondary">
            {autoImport
              ? 'Valid questions will be automatically imported.'
              : 'Questions will be validated but not imported.'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || isProcessing || loading}
          startIcon={isProcessing && <CircularProgress size={20} />}
        >
          {isProcessing ? 'Processing...' : 'Upload & Import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportUploadDialog;