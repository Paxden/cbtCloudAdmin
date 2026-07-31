/**
 * Replace Media Dialog Component
 * Replace an existing media file with a new one
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
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const ReplaceMediaDialog = ({
  open,
  onClose,
  onReplace,
  media,
  loading = false,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/svg+xml': ['.svg'],
      'image/gif': ['.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleReplace = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      await onReplace(file);
      handleClose();
    } catch (err) {
      setError(err.message || 'Replace failed');
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onClose();
  };

  if (!media) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>Replace Image</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Typography variant="body2" color="textSecondary">
            Replace "{media.originalName}" with a new image.
          </Typography>

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
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <Box>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 150,
                    objectFit: 'contain',
                    borderRadius: 8,
                  }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  {file?.name} ({(file?.size / 1024).toFixed(1)} KB)
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1">
                  {isDragActive ? 'Drop the new image here' : 'Drag & drop a new image here'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  or click to browse (PNG, JPEG, SVG, GIF up to 5MB)
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleReplace}
          variant="contained"
          color="warning"
          disabled={!file || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Replacing...' : 'Replace'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplaceMediaDialog;