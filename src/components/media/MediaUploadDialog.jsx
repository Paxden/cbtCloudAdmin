/**
 * Media Upload Dialog Component
 * Upload images to the media library
 */

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

const MediaUploadDialog = ({
  open,
  onClose,
  onUpload,
  loading = false,
}) => {
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');
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

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      await onUpload(file, altText);
      handleClose();
    } catch (err) {
      setError(err.message || 'Upload failed');
    }
  };

  const handleClose = () => {
    setFile(null);
    setAltText('');
    setPreview(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>Upload Image</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            {preview ? (
              <Box sx={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                    borderRadius: 8,
                  }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {file?.name} ({(file?.size / 1024).toFixed(1)} KB)
                </Typography>
              </Box>
            ) : (
              <Box>
                <UploadIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body1">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image here'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  or click to browse (PNG, JPEG, SVG, GIF up to 5MB)
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Alt Text */}
          <TextField
            label="Alternative Text (Alt Text)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            fullWidth
            placeholder="Describe the image for accessibility"
            size="small"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MediaUploadDialog;