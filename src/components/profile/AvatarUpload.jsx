/**
 * Avatar Upload Component
 * Upload and manage profile avatar
 */

import { useState, useRef } from 'react';
import {
  Paper,
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Delete as DeleteIcon } from '@mui/icons-material';

const AvatarUpload = ({ avatar, onUpload, onRemove, loading, error }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setDialogOpen(true);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setDialogOpen(true);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Profile Picture
      </Typography>

      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: 'primary.main',
            fontSize: 48,
            mb: 2,
          }}
          src={previewUrl || avatar}
        >
          {getInitials('User')}
        </Avatar>

        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/png,image/jpeg,image/jpg"
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          startIcon={<PhotoCameraIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          Upload
        </Button>
        {avatar && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onRemove}
            disabled={loading}
          >
            Remove
          </Button>
        )}
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
        PNG or JPEG, max 5MB
      </Typography>

      {/* Error Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Invalid File</DialogTitle>
        <DialogContent>
          <Typography>
            Please upload a valid image file (PNG or JPEG) under 5MB.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default AvatarUpload;