/* eslint-disable no-unused-vars */
/**
 * Image Upload Extension
 * Handles image uploads in the editor
 */

import { useCallback } from 'react';
import { Dialog, Box, CircularProgress } from '@mui/material';

const ImageUploadExtension = ({
  editor,
  open,
  onClose,
  onUpload,
  uploading,
  error,
}) => {
  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file && onUpload) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('image-upload-input')?.click()}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/gif"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          disabled={uploading}
        />

        {uploading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
            <Box sx={{ mt: 2, color: 'text.secondary' }}>Uploading image...</Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: 48, mb: 2 }}>🖼️</Box>
            <Box sx={{ fontWeight: 500, mb: 1 }}>Drop an image here</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              or click to browse (PNG, JPEG, SVG up to 5MB)
            </Box>
          </Box>
        )}

        {error && (
          <Box sx={{ color: 'error.main', mt: 2, fontSize: '0.875rem' }}>
            {error}
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default ImageUploadExtension;